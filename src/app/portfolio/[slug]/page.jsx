'use client'

import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaAngleLeft, FaArrowDown, FaArrowUp, FaPen, FaPlus, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'
import { fetcher, formatDate, formatPrice, getImage, profit, totalCost, totalProfitPercentage } from '../../../../utils/utils'
import Image from 'next/image'
import BalanceCard, { ProfitCard } from '@/components/portfolio/balanceCard'
import AddTransaction from '@/components/portfolio/transactionModals/addTransaction'
import Link from 'next/link'
import DeleteModal from '@/components/portfolio/deleteModal'
import { Context } from '@/context/context'
import Loader from '@/components/loader'
import EditTransaction from '@/components/portfolio/transactionModals/editTransaction'
import TransactionDetails from '@/components/portfolio/transactionModals/TransactionDetails'
import LandingPage from '@/components/portfolio/landingPage'

function Transactions() {
    const {slug} = useParams()
    const {authLoading, user} = useContext(Context)
    const {data: asset, isLoading: transactionLoading, mutate} = useSWR(user?.id, fetchTransaction)
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
    const [showEditTransaction, setShowEditTransaction] = useState(false);
    const [showTransactionDetails, setShowTransactionDetails] = useState(false)
    const [selectedId, setSelectedId] = useState()
    const {showNotification} = useContext(Context)
    const {data, isLoading} = useSWR(
        `v2/cryptocurrency/quotes/latest?slug=${slug}`,
        fetcher
    )
    console.log(asset)

    if(authLoading || transactionLoading || isLoading){
        return <Loader />
    }

    // console.log(transaction)

    if(!asset){
        return (
            <div className='px-8 py-40 text-center flex flex-col items-center justify-center'>
                <p>An error occured</p>
                <Link className='px-3 py-2 rounded-md bg-faded-grey mt-8 ml-4 flex w-fit items-center gap-3' href="/portfolio">
                     <FaAngleLeft/> Back
                </Link>
            </div>
        )
    }
    
    async function fetchTransaction(id){
        const {data} = await supabase.from('assets')
            .select(`*, transactions(*)`)
            .eq('slug', slug)
            .eq('user_id', id)
            .limit(1)
            .single()
            // .order("date", {ascending: false})
        
        return data;
    }
    const transaction = asset.transactions 
    const {id: assetId, coin_name, holding, average_fee} = asset

    function getPrice(){
        return data?.data?.data[coin_name.id]?.quote.USD.price
    }

    function getDurationChange(id, duration){
        return data?.data?.data[id]?.quote.USD[`percent_change_${duration}`]
    }

    function holdingValue(){
        return holding * getPrice()
    }

    function transactionProfit(quantity, cost){
        const currentCost = getPrice() * quantity;
        return formatPrice(currentCost - cost);
    }

    const deleteTransaction = async() => {
        setShowTransactionDetails(false);
        const transactionItem = transaction.find(item => item.id === selectedId);
        const {data, error} = await supabase.from('transactions')
            .delete()
            .eq('id', selectedId);

        if(error) {
            showNotification("An error occured", "#EF4444");
            return;
        }

        if(transactionItem.transaction_type === "buy"){
            updateAsset({average_fee: newAverageBuy(), holding: holding - transactionItem.quantity })
        } else if (transactionItem.transaction_type === "sell"){
            updateAsset({holding: holding + transactionItem.quantity})
        } else {
            if(transactionItem.transfer_type === "in"){
                updateAsset({holding: holding - transactionItem.quantity})
            } else {
                updateAsset({holding: holding + transactionItem.quantity})
            }
        }
        showNotification("Delete Successful", "#EF4444");
        setShowDeleteTransaction(false);
        mutate()
    }

    async function updateAsset(updateObj){
        await supabase.from('assets')
            .update(updateObj)
            .eq('id', assetId)
    }

    function newAverageBuy(){
        const filteredTransaction = transaction.filter(item => item.id !== selectedId);
        const totalBuy = filteredTransaction.reduce((incr, item) => {
            if(item.transaction_type === "buy" && item.id !== selectedId.id){
                return incr + item.total_spent
            }
            return incr
        }, 0)
        
        const totalQty = filteredTransaction.reduce((incr, item) => {
            if(item.transaction_type === "buy" && item.id !== selectedId.id){
                return incr + item.quantity
            }
            return incr
        }, 0)
        return totalBuy / totalQty;
    }

    function showDelete(e, id){
        e.stopPropagation();
        setSelectedId(id);
        setShowDeleteTransaction(true);
    }

    function showEdit(e, id){
        e.stopPropagation();
        setSelectedId(id)
        setShowEditTransaction(true)
    }

    function showDetails(id){
        setSelectedId(id)
        setShowTransactionDetails(true)
    }
    
    return (
        <main>
            {showTransactionDetails && <TransactionDetails 
                hideModal={setShowTransactionDetails}
                transaction={transaction.filter(item => item.id === selectedId)}
                showDelete={setShowDeleteTransaction}
                showEdit={setShowEditTransaction}
                coin_name={asset.coin_name}
            />}
            {showAddTransaction && <AddTransaction 
                mutate={mutate} 
                hideModal={setShowAddTransaction } 
                transactions={transaction} 
                coin={asset}
            />}
            {showDeleteTransaction && <DeleteModal
                hideModal={setShowDeleteTransaction}
                heading="Delete Transaction?"
                content="Are you sure you want to remove this transaction?"
                deleteFunc={deleteTransaction}
            />}
            {showEditTransaction && <EditTransaction 
                id={selectedId}
                coin={transaction[0].assets}
                callbackFunc={mutate} 
                hideFunction={setShowEditTransaction} 
                transaction={transaction}
                assets={asset}
            />}
            {user ? (<section className='px-4 sm:px-8 py-8'>
                <Link className='px-3 py-2 rounded-md bg-faded-grey flex w-fit items-center gap-3' href="/portfolio">
                     <FaAngleLeft/> Back
                </Link> 
                <article className='mt-3'>
                    <h1>
                        <span className='text-xs text-medium-grey'>{coin_name.name} ({coin_name.symbol}) Balance</span>
                        <div className='flex items-center gap-4 font-bold py-2'>
                            <Image
                                src={getImage(coin_name.id)}
                                height={32}
                                width={32}
                                alt='Coin Logo'
                            />
                            <p className='text-3xl'>${formatPrice(holdingValue())}</p>
                            <span 
                                className={`${getDurationChange(coin_name.id, '24h') > 1 ?"bg-green-500" : "bg-red-500"} ml-auto sm:ml-0 p-1 text-white rounded-md`}
                            >
                                {getDurationChange(coin_name.id, '24h')?.toFixed(2)}%
                            </span>
                        </div>
                    </h1>
                    <div className='flex flex-col sm:flex-row gap-4 mt-2'>
                        <BalanceCard amount={holding} note='Quantity' />
                        <BalanceCard amount={`$${formatPrice(totalCost(transaction))}`} note='Total costs' />
                        <BalanceCard amount={`$${formatPrice(average_fee)}`} note='Average Buying Costs' />
                        <ProfitCard amount={`$${profit(transaction, average_fee, getPrice())}`} percentage={totalProfitPercentage(transaction, average_fee, getPrice())} />
                    </div>
                </article>
                <div className='pt-8 pb-4 flex items-center justify-between'>
                    <h4 className='sm:text-xl font-semibold'><span className='hidden sm:inline'>{coin_name.name}</span> Transactions</h4>
                    <button 
                        onClick={()=>setShowAddTransaction(true)} 
                        className="add-transaction"
                    >
                        <FaPlus/> Add Transaction
                    </button>
                </div>
                <div className='py-4'>
                    <table className='w-full text-right border-faded-grey'>
                        <thead className='border-y'>
                            <tr className='text-sm'>
                                <th className='text-left p-2.5'>Type</th>
                                <th className='hidden sm:table-cell'>Price</th>
                                <th >Amount</th>
                                <th className='hidden sm:table-cell'>Fees</th>
                                <th className='hidden md:table-cell'>PNL</th>
                                <th className='hidden md:table-cell'>Notes</th>
                                <th className='hidden sm:table-cell'>Action</th>
                            </tr>
                        </thead>
                        <tbody className='font-semibold'>
                            {transaction.map(item => {
                                return(
                                    <tr onClick={()=>showDetails(item.id)} key={item.id} className='text-sm border-b border-faded-grey'>
                                        <td className='text-left'>
                                            <div className='flex items-center gap-3'>
                                                <div className='capitalize shrink-0  text-white h-6 w-6 rounded-full grid place-content-center bg-medium-grey/50'>
                                                    {item.transaction_type !== "transfer" && item.transaction_type[0]}
                                                    {item.transfer_type === "in" && <FaArrowDown />}
                                                    {item.transfer_type === "out" && <FaArrowUp />}
                                                </div>
                                                <div>
                                                    <p className='capitalize'>{item.transaction_type} {item.transfer_type}</p>
                                                    <p className='text-ellipsis whitespace-nowrap overflow-hidden'>{formatDate(item.date)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className='hidden sm:table-cell'>{item.transaction_type === "transfer" ? "--" : `${formatPrice(item.price)}`}</td>
                                        <td>
                                            <div className='p-2.5'>
                                                {item.transaction_type !== "transfer" ? <p>
                                                    {item.transaction_type === "buy" ? "+" : "-"}
                                                    ${formatPrice(item.price * item.quantity)}
                                                </p> : "--"}
                                                {item.transaction_type !== "transfer" ? (<p 
                                                    className={item.transaction_type === "buy" ? "text-green-500":"text-red-500"}
                                                >
                                                    {item.transaction_type === "buy" ? "+" : "-"}
                                                    {item.quantity} {coin_name.symbol}
                                                </p>):(
                                                    <p 
                                                        className={item.transfer_type === "in" ? "text-green-500":"text-red-500"}
                                                    >
                                                        {item.transfer_type === "in" ? "+" : "-"}
                                                        {item.quantity} {coin_name.symbol}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className='hidden sm:table-cell'>{item.fee ?? '--'}</td>
                                        <td className='hidden md:table-cell'>
                                            {item.transaction_type === "buy" ? <p className={transactionProfit(item.quantity, item.total_spent) > 0 ? "text-green-500":"text-red-500"}>
                                                ${transactionProfit(item.quantity, item.total_spent)}
                                            </p> : "-"}
                                        </td>
                                        <td className='hidden sm:table-cell'></td>
                                        <td className='text-green-500 hidden sm:table-cell'>
                                            <div className='flex flex-col sm:flex-row gap-3 items-center justify-end'>
                                                <button onClick={(e)=>showEdit(e, item.id)} className='hover:bg-faded-grey p-2.5 rounded-full'><FaPen /></button>
                                                <button onClick={(e)=>showDelete(e, item.id)} className='hover:bg-faded-grey p-2.5 rounded-full'><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>):(
                <LandingPage />
            )}
        </main>
    )
}

export default Transactions