import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getImage, profit, totalCost, totalProfit, totalProfitPercentage } from '../../../utils/utils'
import { FaAngleRight, FaEllipsisV, FaPlus, FaTrash } from 'react-icons/fa'
import Link from 'next/link'
import PercentageChangeRow from '../percentageChange'
import DeleteAsset from './deleteAsset'
import BalanceCard, { ProfitCard } from './balanceCard'

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip);

const options = {
    legend: {
      display: true
    }
};

function Assets({assets, prices, showAddModal}) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const colors = useMemo(()=>{
        return assets?.map(item => getRandomRGBA())
    },[assets])

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

    function getRandomRGBA() {
        const red = Math.floor(Math.random() * 256);
        const green = Math.floor(Math.random() * 256);
        const blue = Math.floor(Math.random() * 256);
      
        return `rgba(${red}, ${green}, ${blue}, ${1})`;
    }

    const assetsData = {
        labels: assets.map(item => item.coin_name.name),
        datasets: [
            {
                label: '% of Assets',
                data: assets.map(item => item.holding * getPrice(item.coin_name.id)),
                backgroundColor: colors,
            },
        ],
    };

    function calculatePercentage(item){
        const totalAssets = totalBalance();
        const assetPrice = item.holding * getPrice(item.coin_name.id)
        const percentage = (assetPrice / totalAssets) * 100;
        return percentage.toFixed(2)
    }

    return (
    <>
        <div className='flex'>
            <div className='flex flex-col sm:flex-row items-center w-full  mt-4 md:mt-1 md:w-1/2 bg-news-grey gap-8 p-8 rounded-md'>
                <div className="w-full sm:w-1/2 py-2">
                    <Doughnut data={assetsData} options={options} /> 
                </div>
                <ul className='flex-1'>
                    {
                        assets.map((item, index) =>{
                            return (
                                <li key={index} className='flex font-medium items-center gap-2 mb-2 last:mb-0'>
                                    <div className='h-4 w-4 rounded-full' style={{backgroundColor: colors[index]}}/>
                                    {item.coin_name.name}
                                    <span className='ml-auto'>{calculatePercentage(item)}%</span>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 sm:gap-6 mt-4'>
            <BalanceCard amount={`$${formatePrice(totalBalance())}`} note="Total Balance" />
            <ProfitCard 
                amount={`$${formatePrice(generalProfit())}`}
                percentage={profitPercentage()}
            />

        </div>
        <section>
            {showDeleteModal && <DeleteAsset hideModal={setShowDeleteModal} id={selectedId} />}
            <h3 className='font-semibold text-lg py-2 sm:text-xl mb-4 flex items-between justify-between gap-2'>
                Assets
                <button onClick={()=>showAddModal(true)} className='bg-green-500 p-2 rounded flex sm:hidden items-center gap-2 text-sm text-white'><FaPlus/> Add New Coin</button>
            </h3>
            <div className="relative">
                <table className='w-full text-sm'>
                    <thead className='border-y border-faded-grey text-end sticky top-0 bg-white'>
                        <tr>
                            <th className='p-2 text-center sticky left-0 bg-white'>Name</th>
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
                                <tr key={item.id} className='border-b border-faded-grey '>
                                    <td className='sticky left-0 bg-white pr-2'>
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
                                        <Link href={`/portfolio/${item.slug}`}>
                                            <p>${formatePrice(item.holding * getPrice(item.coin_name.id))}</p>
                                            <p>{item.holding} {item.coin_name.symbol}</p>
                                        </Link>
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
        <div ref={menu} className='w-48 px-2 py-4 z-20 text-left rounded-lg shadow-2xl text-sm absolute right-0 hidden top-full bg-white font-semibold'>
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