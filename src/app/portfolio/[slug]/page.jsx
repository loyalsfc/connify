'use client'

import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { FaAngleLeft, FaArrowDown, FaArrowUp, FaPen, FaPlus, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'
import { fetcher, formatPrice, getImage } from '../../../../utils/utils'
import Image from 'next/image'
import BalanceCard, { ProfitCard } from '@/components/portfolio/balanceCard'
import AddTransaction from '@/components/portfolio/addTransaction'
import Link from 'next/link'
import DeleteModal from '@/components/portfolio/deleteModal'
import { Context } from '@/context/context'

function Transactions() {
    const {slug} = useParams()
    const {data: transaction, isLoading: transactionLoading} = useSWR('transactions', fetchTransaction)
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const [showDeleteTransaction, setShowDeleteTransaction] = useState(false);
    const [selectedId, setSelectedId] = useState({})
    const {showNotification} = useContext(Context)
    const {data, isLoading} = useSWR(
        `v2/cryptocurrency/quotes/latest?slug=${slug}`,
        fetcher
    )
    
    if(transactionLoading || isLoading){
        return <p className='px-8 py-40 text-center'>I dey load</p>
    }

    if(!transaction?.length){
        return <p className='px-8 py-40 text-center'>An error occured</p>
    }
    
    async function fetchTransaction(){
        const {data} = await supabase.from('transactions')
            .select(`*, assets(*)`)
            .eq('asset_slug', slug)
            .order("created_at", {ascending: false})
        return data;
    }   
    const {id: assetId, coin_name, holding, average_fee} = transaction[0].assets
    // console.log(transaction[0].assets);

    function getPrice(){
        return data?.data?.data[coin_name.id]?.quote.USD.price
    }

    function getDurationChange(id, duration){
        return data?.data?.data[id]?.quote.USD[`percent_change_${duration}`]
    }

    function totalCost(){
        let cost = 0
        transaction.forEach(item => {
            if(item.transaction_type === "buy"){
                return cost += item.total_spent
            }
        })
        return cost;
    }

    function holdingValue(){
        return holding * getPrice()
    }

    function soldCoinProfit(){
        let profit = 0;
        transaction.forEach(item => {
            if(item.transaction_type === "sell"){
                let cost = item.quantity * average_fee;
                profit += (item.total_spent - cost)
            }
        })
        return profit;
    }

    function calculateAssetProfits(){
        const purchasedAssets = transaction.reduce((acc, item) => {
            if (item.transaction_type === 'buy') {
                return acc + item.quantity;
            } else if (item.transaction_type === 'sell'){
                return acc - item.quantity
            }
            return acc;
          }, 0);
        const currentAssetCost = purchasedAssets * average_fee;
        const currentAssetPrice = purchasedAssets * getPrice()
        let profit = currentAssetPrice - currentAssetCost;
        return profit;
    }

    function calculateTransferInProfit(){
        const transferIn = transaction.reduce((acc, item) => {
            if (item.transfer_type === 'in') {
                return acc + item.quantity;
            }
            return acc;
          }, 0);
          return transferIn * getPrice();
    }

    function calculateTransferOutCost(){
        const transferOut = transaction.reduce((acc, item) => {
            if (item.transfer_type === 'out') {
                return acc + item.quantity;
            }
            return acc;
        }, 0);
        return transferOut * getPrice();
    }

    function totalProfit(){
        return (soldCoinProfit() + calculateAssetProfits() + calculateTransferInProfit()) - calculateTransferOutCost()
    }

    function profit(){
        let profit = totalProfit()
        
        if(profit > 0){
            return formatPrice(profit);
        } else {
            if(profit < -1){
                return profit.toFixed(2);
            } else {
                return profit.toFixed(8);
            }
        }
    }

    function totalProfitPercentage(){
        const profit = totalProfit();
        const percentage = (profit / totalCost()) * 100;
        return percentage.toFixed(2);
    }

    function transactionProfit(quantity, cost){
        const currentCost = getPrice() * quantity;
        return formatPrice(currentCost - cost);
    }

    function formatDate(date){
        const dateObj = new Date(date)
        const formattedDate = dateObj.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        return formattedDate;
    }

    const deleteTransaction = async() => {
        const transactionItem = transaction.find(item => item.id === selectedId)
        const {data, error} = await supabase.from('transactions')
            .delete()
            .eq('id', selectedId)
        console.log(data, error)

        if(error) {
            showNotification("An error occured", "#EF4444");
            return;
        }

        if(transactionItem.transaction_type === "buy"){
            const {data, error} = await supabase.from('assets')
                .update({average_fee: newAverageBuy(), holding: holding - transactionItem.quantity })
                .eq('id', assetId)
            console.log(data, error)
        } else if (transactionItem.transaction_type === "sell"){
            const {data, error} = await supabase.from('assets')
                .update({holding: holding + transactionItem.quantity})
                .eq('id', assetId)
            console.log(data, error)
        } else {
            if(transactionItem.transfer_type === "in"){
                const {data, error} = await supabase.from('assets')
                    .update({holding: holding - transactionItem.quantity})
                    .eq('id', assetId)
                console.log(data, error)
            } else {
                const {data, error} = await supabase.from('assets')
                    .update({holding: holding + transactionItem.quantity})
                    .eq('id', assetId)
                console.log(data, error)
            }
        }
        showNotification("Delete Successful", "#EF4444");

    }

    function newAverageBuy(){
        const totalBuy = transaction.reduce((incr, item) => {
            if(item.transaction_type === "buy" && item.id !== selectedId.id){
                return incr + item.total_spent
            }
            return incr
        }, 0)
        
        const totalQty = transaction.reduce((incr, item) => {
            if(item.transaction_type === "buy" && item.id !== selectedId.id){
                return incr + item.quantity
            }
            return incr
        }, 0)
        return totalBuy / totalQty;
    }

    function showModal(id){
        setSelectedId(id);
        setShowDeleteTransaction(true);
    }

    return (
        <main>
            {showAddTransaction && <AddTransaction hideModal={setShowAddTransaction } transactions={transaction} />}
            {showDeleteTransaction && <DeleteModal
                hideModal={setShowDeleteTransaction}
                heading="Delete Transaction?"
                content="Are you sure you want to remove this transaction?"
                deleteFunc={deleteTransaction}
            />}
            <section className='px-4 sm:px-8 py-8'>
                <Link href="/portfolio">
                    <button className='px-3 py-2 rounded-md bg-faded-grey flex items-center gap-3'> <FaAngleLeft/> Back</button>
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
                                className={`${getDurationChange(coin_name.id, '24h') > 1 ?"bg-green-500" : "bg-red-500"} p-1 text-white rounded-md`}
                            >
                                {getDurationChange(coin_name.id, '24h').toFixed(2)}%
                            </span>
                        </div>
                    </h1>
                    <div className='flex gap-4'>
                        <BalanceCard amount={holding} note='Quantity' />
                        <BalanceCard amount={`$${formatPrice(totalCost())}`} note='Total costs' />
                        <BalanceCard amount={`$${formatPrice(average_fee)}`} note='Average Buying Costs' />
                        <ProfitCard amount={`$${profit()}`} percentage={totalProfitPercentage()} />
                    </div>
                </article>
                <div className='pt-8 pb-4 flex items-center justify-between'>
                    <h4 className='text-xl font-semibold'>{coin_name.name} Transactions</h4>
                    <button onClick={()=>setShowAddTransaction(true)} className="bg-green-500 text-white font-semibold flex items-center gap-2 p-2 rounded-md"><FaPlus/> Add Transaction</button>
                </div>
                <div className='py-4'>
                    <table className='w-full text-right border-faded-grey'>
                        <thead className='border-y'>
                            <tr className='text-sm'>
                                <th className='text-left p-2.5'>Type</th>
                                <th>Price</th>
                                <th>Amount</th>
                                <th>Fees</th>
                                <th>PNL</th>
                                <th>Notes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='font-semibold'>
                            {transaction.map(item => {
                                return(
                                    <tr key={item.id} className='text-sm border-b border-faded-grey'>
                                        <td className='text-left'>
                                            <div className='flex items-center gap-3'>
                                                <div className='capitalize  text-white h-6 w-6 rounded-full grid place-content-center bg-medium-grey/50'>
                                                    {item.transaction_type !== "transfer" && item.transaction_type[0]}
                                                    {item.transfer_type === "in" && <FaArrowDown />}
                                                    {item.transfer_type === "out" && <FaArrowUp />}
                                                </div>
                                                <div>
                                                    <p className='capitalize'>{item.transaction_type} {item.transfer_type}</p>
                                                    <p>{formatDate(item.date)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.transaction_type === "transfer" ? "--" : `${formatPrice(item.price)}`}</td>
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
                                        <td>{item.fee ?? '--'}</td>
                                        <td>
                                            {item.transaction_type === "buy" ? <p className={transactionProfit(item.quantity, item.total_spent) > 0 ? "text-green-500":"text-red-500"}>
                                                ${transactionProfit(item.quantity, item.total_spent)}
                                            </p> : "-"}
                                        </td>
                                        <td></td>
                                        <td className='text-green-500'>
                                            <div className='p-2.5 flex gap-3 justify-end'>
                                                <button className='hover:bg-faded-grey'><FaPen /></button>
                                                <button onClick={()=>showModal(item.id)} className='hover:bg-faded-grey'><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    )
}

export default Transactions