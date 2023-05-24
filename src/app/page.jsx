'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { ExpandLess, ExpandMore, StarRateOutlined } from '@mui/icons-material'
import { fetcher, getCoinVolume, numberToString, toTwoDecimalPlace } from '../../utils/utils'
import Pagination from '@/components/pagination'
import { FaAngleLeft, FaAngleRight, FaMagento } from 'react-icons/fa'

function Home() {
    const [pageIndex, setPageIndex] = useState(0)
    const [limit, setLimit] = useState(100)
    const fetcherWithParam = (url) => axios.post(`http://192.168.0.192:5000/api/${url}`, {
        start: (pageIndex * limit) + 1,  limit})
    const {data: coins, error, isLoading} = useSWR("list", fetcherWithParam)
    const {data: metrics, error: metricsError, isLoading: metricsLoading} = useSWR("global-metrics", fetcher)
    const [totalCoins, setTotalCoins] = useState(metrics?.data?.data?.active_cryptocurrencies)
    // const [offsets, setOffSets] = useState(Math.ceil(totalCoins / limit))
 
    useEffect(()=>{
        setTotalCoins(metrics?.data?.data?.active_cryptocurrencies)
    },[metrics])

    return (
        <main>
            <div className='mt-8 mb-12 px-8'>
                <h1 className='text-2xl font-bold mb-2'>Today's Cryptocurrency Prices by Market Cap</h1>
                <p className='text-sm'>The global cryptocurrency market cap today is $1.17 Trillion, a {!metricsLoading && <span className={metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}>{metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change.toFixed(1)}%</span>} change in the last 24 hours</p>
                {metricsLoading === false &&
                    <ul className='grid grid-cols-4 gap-4 mt-3'>
                        <CryptoInfo 
                            title={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_market_cap))}`}
                            submenu="Market Capitalization"
                            borderColor={metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}
                        />
                        <CryptoInfo 
                            title={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_volume_24h))}`}
                            submenu="24h Trading Volume"
                            borderColor={metrics?.data?.data?.quote?.USD.total_volume_24h_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}
                        />
                        <CryptoInfo 
                            title={`${metrics?.data?.data?.btc_dominance.toFixed(1)}%`}
                            submenu="Bitcoin Market Cap Dominance"
                            borderColor="border-gray-300"
                        />
                        <CryptoInfo 
                            title={numberToString(metrics?.data?.data?.total_cryptocurrencies)}
                            submenu="# of Coins"
                            borderColor="border-gray-300"
                        />
                    </ul>
                }
            </div>
            <div className='px-8 relative mb-10'>
                <table className='text-sm mx-auto w-full mb-4'>
                    <thead className="sticky top-0 bg-white">
                        <tr className='border-y border-faded-grey'>
                            <th className='p-2.5 cursor-pointer'></th>
                            <th className='p-2.5 cursor-pointer'>#</th>
                            <th className='p-2.5 cursor-pointer'>Name</th>
                            <th className='p-2.5 cursor-pointer'>Price</th>
                            <th className='p-2.5 cursor-pointer'>1h%</th>
                            <th className='p-2.5 cursor-pointer'>24h%</th>
                            <th className='p-2.5 cursor-pointer'>7d%</th>
                            <th className='p-2.5 cursor-pointer'>Market Cap</th>
                            <th className='p-2.5 cursor-pointer'>Volume (24h)</th>
                            <th className='p-2.5 cursor-pointer'>Circulating Supply</th>
                        </tr>
                    </thead>
                    <tbody className='font-semibold'>
                        {isLoading === false && 
                            coins?.data?.data.map((coin, index) => {
                                const {id, name, quote, symbol, circulating_supply} = coin
                                const {price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h} = quote?.USD
                                return(
                                    <tr className="border-b border-faded-grey hover:bg-[#F8FAFD]" key={id}>
                                        <td className='p-2.5'><StarRateOutlined/></td>
                                        <td className='p-2.5'>{(pageIndex * limit) + (index + 1)}</td>
                                        <td className='p-2.5 text-left'>{name} <span className='text-dark-grey'>{symbol}</span></td>
                                        <td className='p-2.5 text-right'>${price.toFixed(2)}</td>
                                        <PercentageChangeRow percentChange={percent_change_1h} />
                                        <PercentageChangeRow percentChange={percent_change_24h} />
                                        <PercentageChangeRow percentChange={percent_change_7d} />
                                        <td className='p-2.5'>${toTwoDecimalPlace(market_cap)}</td>
                                        <td className='p-2.5 text-right'>
                                            ${toTwoDecimalPlace(volume_24h)} <br/>
                                            <span className='text-xs text-medium-grey'>{getCoinVolume(volume_24h, price)} {symbol}</span>
                                        </td>
                                        <td className='p-2.5 text-right'>{numberToString(Math.floor(circulating_supply))} {symbol}</td>
                                    </tr>
                                )
                            })

                        }
                    </tbody>
                </table>
                <div className='flex  justify-between'>
                    <p>Showing {(pageIndex * limit) + 1} - {(pageIndex + 1) * limit } </p>
                    <div className='flex items-center border border-faded-grey rounded'>
                        <button 
                            disabled={pageIndex == 0 ? true : false}
                            className='hover:bg-green-400 h-full block hover:text-white px-2.5 py-1 border-r border-faded-grey'
                            onClick={() => setPageIndex(pageIndex - 1)}
                        >
                            <FaAngleLeft />
                        </button>
                        {!metricsLoading &&
                            <Pagination handleClick={setPageIndex} c={pageIndex} m={Math.ceil(totalCoins / limit)}/>    
                        }
                        <button 
                            disabled={pageIndex == (limit + 1) ? true : false}
                            className='hover:bg-green-400 hover:text-white px-2.5 py-1 h-full block'
                            onClick={() => setPageIndex(pageIndex + 1)}
                        >
                            <FaAngleRight />    
                        </button>
                    </div>
                    <div className='text-sm flex items-center gap-1'>
                        <label htmlFor="selectrow" className='text-medium-grey'>Show rows</label>
                        <select className='focus:outline-none bg-faded-grey py-1.5 px-2 rounded text-black' name="limit" id="limit" value={limit} onChange={(e)=>setLimit(parseInt(e.target.value))}>
                            <option value="100">100</option>
                            <option value="50">50</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                </div>
            </div>

            <section className='bg-news-grey px-8 py-12 mb-12'>
                <article className='text-center border border-dark-grey p'>
                    <div className='w-3/5 mx-auto'>
                        <h1 className='pt-16 pb-2 text-3xl font-semibold'>Be the first to know about every crypto news every day</h1>
                        <p className='mb-8'>Get crypto analysis, news and updates right to your inbox! Sign up here so you don't miss a single newsletter.</p>
                        <div className='flex items-center gap-4 mb-16'>
                            <input type='email' className='bg-transparent flex-1 border border-dark-grey py-3 px-6 text-sm' /><button className='text-sm font-semibold text-white bg-green-600 rounded-md py-3 px-6'>Subscribe now</button>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

function PercentageChangeRow({percentChange}){
    return <td className={percentChange > 0 ? "text-green-500 p-2.5" : "text-red-500 p-2.5"}>
        <p className='flex items-center'>
            <span>{percentChange > 0 ? <ExpandLess fontSize='small' /> : <ExpandMore fontSize='small' />}</span>
            <span>{percentChange.toFixed(2)}%</span>
        </p>
    </td>
}

function CryptoInfo({title, submenu, borderColor}){
    return <li className={`p-4 overflow-hidden border-l-8 shadow rounded-lg ${borderColor}`}>
        <h3 className='truncate text-gray-900 text-xl font-medium inline-flex '>{title}</h3>
        <p className='text-sm text-dark-grey truncate font-medium'>{submenu}</p>
    </li>
}

export default Home
