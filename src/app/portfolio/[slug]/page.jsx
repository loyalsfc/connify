'use client'

import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { FaAngleLeft, FaPen, FaPlus, FaTrash } from 'react-icons/fa'
import useSWR from 'swr'
import { calculateProfitLoss, fetcher, formatPrice, getImage, getProfitPercentage } from '../../../../utils/utils'
import Image from 'next/image'
import BalanceCard from '@/components/portfolio/balanceCard'
import AddTransaction from '@/components/portfolio/addTransaction'

function Transactions() {
    const {slug} = useParams()
    const {data: transaction, isLoading: transactionLoading} = useSWR('transactions', fetchTransaction)
    const [showAddTransaction, setShowAddTransaction] = useState(false);
    const {data, isLoading, error} = useSWR(
        `v2/cryptocurrency/quotes/latest?slug=${slug}`,
        fetcher
    )
    if(transactionLoading || isLoading){
        return <p>I dey load</p>
    }
    // const {assets, date, fee, id: transactionId, note, price, quantity, total_spent, transaction_type, transfer_type } = transaction
    // console.log(transaction, data)
    async function fetchTransaction(){
        const {data, error} = await supabase.from('transactions')
            .select(`*, assets(*)`)
            .eq('asset_slug', slug)
        return data;
    }   
    const {id: assetId, coin_name, holding, average_fee} = transaction[0].assets
    console.log(transaction[0].assets)

    function getPrice(id){
        return data?.data?.data[id]?.quote.USD.price
    }

    function getDurationChange(id, duration){
        return data?.data?.data[id]?.quote.USD[`percent_change_${duration}`]
    }

    function totalCost(){
        const initialValue = 0
        const totalCost = transaction.reduce((incr, val) => incr + val.total_spent, initialValue)
        return totalCost
    }

    function holdingValue(){
        return holding * getPrice(coin_name.id)
    }

    function profit(){
        const profit = calculateProfitLoss(holdingValue(), totalCost())
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

    function transactionProfit(price, quantity, cost){
        const currentCost = price * quantity
        return formatPrice(currentCost - cost)
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

    return (
        <main>
            {showAddTransaction && <AddTransaction hideModal={setShowAddTransaction } transactions={transaction} />}
            <section className='px-4 sm:px-8 py-8'>
                <button className='px-3 py-2 rounded-md bg-faded-grey flex items-center gap-3'> <FaAngleLeft/> Back</button>
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
                        <BalanceCard amount={`$${profit()}`} note={`Profit / Loss (${getProfitPercentage(holdingValue(), totalCost())}%)`} />
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
                                    <tr className='text-sm border-b border-faded-grey'>
                                        <td className='text-left'>
                                            <div className='flex items-center gap-3'>
                                                <div className='capitalize  text-white h-6 w-6 rounded-full grid place-content-center bg-medium-grey/50'>{item.transaction_type[0]}</div>
                                                <div>
                                                    <p className='capitalize'>{item.transaction_type}</p>
                                                    <p>{formatDate(item.date)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${formatPrice(item.price)}</td>
                                        <td>
                                            <div className='p-2.5'>
                                                <p>{item.transaction_type === "buy" ? "+" : "-"}${formatPrice(item.price * item.quantity)}</p>
                                                <p 
                                                    className={item.transaction_type === "buy" ? "text-green-500":"text-red-500"}
                                                >
                                                    {item.transaction_type === "buy" ? "+" : "-"}{item.quantity} {coin_name.symbol}
                                                </p>
                                            </div>
                                        </td>
                                        <td>{item.fee ?? '--'}</td>
                                        <td>{transactionProfit(item.price, item.quantity, item.cost)}</td>
                                        <td></td>
                                        <td className='text-green-500'>
                                            <div className='p-2.5 flex gap-3 justify-end'>
                                                <button><FaPen /></button>
                                                <button><FaTrash /></button>
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