import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { calculateProfitLoss, fetcher, getImage, getProfitPercentage, profit, toTwoDecimalPlace, totalCost, totalProfit, totalProfitPercentage } from '../../../utils/utils'
import { FaAngleRight, FaEllipsisV, FaPlus, FaTrash } from 'react-icons/fa'
import Link from 'next/link'
import useSWR from 'swr'
import PercentageChangeRow from '../percentageChange'
import DeleteAsset from './deleteAsset'
import BalanceCard, { ProfitCard } from './balanceCard'

function Assets({assets, prices}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    
    // if(isLoading) return 'hi'ffhfhffhjh 

    function getFormatedPrice(id){
        return formatePrice(getPrice(id))
    }

    function getPrice(id){
        return prices?.data?.data[id]?.quote.USD.price
    }

    function getDurationChange(id, duration){
        return prices?.data?.data[id]?.quote.USD[`percent_change_${duration}`]
    }

    function formatePrice(price){
        if(!price){
            return 0
        }
        if(price > 999){
            return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else if(price > 1){
            return price.toFixed(2)
        } else if (price > 0.001){
            return price.toFixed(6)
        } else {
            return price.toFixed(8)
        }
    }

    const showMenu =(e, id) => {
        e.currentTarget.nextElementSibling.classList.remove('hidden');
        setSelectedId(id)
    }

    const totalBalance = () => {
        const initialBalance = 0;
        const total = assets.reduce(sumTotal, initialBalance);
        return total
    }

    const sumTotal = (accumulator, coin) => {
        let itemCurrentValue = coin.holding * getPrice(coin.coin_name.id);
        return accumulator + itemCurrentValue;
    }

    const generalProfit = () => {
        const profits = assets.map(item => totalProfit(item.transactions, item.average_fee, getPrice(item.coin_name.id)))
        let total = profits.reduce(
            (accumulator, currentValue) => accumulator + parseFloat(currentValue),0
        )
        return total;
    }

    const totalAverageBuy = () => {
        const buyprices = assets.map(item => item.holding * item.average_fee)
        let initialValue = 0;
        let total = buyprices.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
        )
        return total;
    }

    function totalPurchase(){
        const costs = assets.reduce((incr, item) =>{
            return incr + totalCost(item.transactions)
        },0)
        return costs
    }

    const profitPercentage = () => {
        const percent = (generalProfit() / totalPurchase()) * 100;
        return percent.toFixed(2)
    }

    return (
    <>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4'>
            <BalanceCard amount={`$${formatePrice(totalBalance())}`} note="Total Balance" />
            <ProfitCard 
                amount={`$${formatePrice(generalProfit())}`}
                percentage={profitPercentage()}
            />

        </div>
        <section>
            {showDeleteModal && <DeleteAsset hideModal={setShowDeleteModal} id={selectedId} />}
            <h3 className='font-semibold text-xl mb-4'>
                Assets
                <button><FaPlus/> New Transaction</button>
            </h3>
            <div className="relative">
                <table className='w-full text-sm'>
                    <thead className='border-y border-faded-grey text-end sticky top-0 bg-white'>
                        <tr>
                            <th className='p-2 text-center'>Name</th>
                            <th className='p-2'>Price</th>
                            <th className='p-2 text-center hidden sm:table-cell'>1h</th>
                            <th className='p-2 text-center hidden lg:table-cell'>24h</th>
                            <th className='p-2 text-center hidden lg:table-cell'>7d</th>
                            <th className='p-2'>Holdings</th>
                            <th className='p-2 hidden md:table-cell'>Avg. Buy Price</th>
                            <th className='p-2 hidden sm:table-cell'>PNL</th>
                            <th className='p-2'></th>
                        </tr>
                    </thead>
                    <tbody className='text-end'>
                        {assets.map(item => {
                            let profitPercent = totalProfitPercentage(item.transactions, item.average_fee, getPrice(item.coin_name.id))
                            return(
                                <tr key={item.id} className='border-b border-faded-grey'>
                                    <td>
                                        <Link href={`/coins/${item.coin_name.slug}`}>
                                            <div className='flex items-center gap-3 font-semibold px-2 py-3'>
                                                <Image
                                                    src={getImage(item.coin_name.id)}
                                                    height={24}
                                                    width={24}
                                                    alt='Logo'
                                                />
                                                <p className='flex flex-col sm:flex-row sm:gap-3 text-left'>
                                                    <span>{item.coin_name.name}</span>
                                                    <span className='opacity-50'>{item.coin_name.symbol}</span>
                                                </p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className='px-3'>${getFormatedPrice(item.coin_name.id)}</td>
                                    <PercentageChangeRow hideSm={true} percentChange={getDurationChange(item.coin_name.id, '1h')} />
                                    <PercentageChangeRow hide={true} percentChange={getDurationChange(item.coin_name.id, '24h')} />
                                    <PercentageChangeRow hide={true} percentChange={getDurationChange(item.coin_name.id, '7d')} />
                                    <td>
                                        <div>
                                            <p>${formatePrice(item.holding * getPrice(item.coin_name.id))}</p>
                                            <p>{item.holding} {item.coin_name.symbol}</p>
                                        </div>
                                    </td>
                                    <td className='hidden md:table-cell'>${formatePrice(item.average_fee)}</td>
                                    <td className='p-2 hidden sm:table-cell'> 
                                        <p>{profit(item.transactions, item.average_fee, getPrice(item.coin_name.id))}</p>
                                        <p className={profitPercent > 0 ? "text-green-500" : "text-red-500"}>
                                            {profitPercent}%
                                        </p>
                                    </td>
                                    <td className='p-2 py-4'>
                                        <div className='flex gap-2 items-center relative'>
                                            <button className='opacity-40' onClick={(e)=>showMenu(e, item.id)}><FaEllipsisV/></button>
                                            <RowMenu slug={item.slug} showDeleteModal={setShowDeleteModal}/>    
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    </>
    )
}

function RowMenu({slug, showDeleteModal}){
    const menu = useRef(null)
    
    useEffect(()=>{
        const hideMenu = (e) => {
            if(menu.current && !menu.current.contains(e.target) && !menu.current.previousElementSibling.contains(e.target)){
                menu.current.classList.add('hidden')
            }
        }
        document.addEventListener('click', hideMenu)

        return () => {
            document.removeEventListener('click', hideMenu)
        }
    },[])

    return(
        <div ref={menu} className='w-48 px-2 py-4 z-10 text-left rounded-lg shadow-2xl text-sm absolute right-0 hidden top-full bg-white font-semibold'>
            <ul>
                <li 
                    className='flex p-2 hover:bg-faded-grey items-center gap-2 cursor-pointer'
                >
                    <FaPlus /> Add Transactions
                </li>
                <li 
                    className='p-2 hover:bg-faded-grey cursor-pointer'
                >
                    <Link 
                        href={`/portfolio/${slug}`}
                        className='flex items-center gap-2'
                    >
                        <FaAngleRight /> View Transactions
                    </Link>
                </li>
                <li 
                    onClick={()=>showDeleteModal(true)}
                    className='flex p-2 hover:bg-faded-grey items-center gap-2 cursor-pointer'
                >
                    <FaTrash />  Remove Assets
                </li>
            </ul>
        </div>
    )
}

export default Assets