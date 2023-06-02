'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { ExpandLess, ExpandMore, StarRateOutlined } from '@mui/icons-material'
import { fetcher, getCoinVolume, numberToString, toTwoDecimalPlace } from '../../utils/utils'
import Pagination from '@/components/pagination'
import { FaRegStar, FaStar } from 'react-icons/fa'
import Link from 'next/link'

function Home() {
    const [pageIndex, setPageIndex] = useState(0)
    const [limit, setLimit] = useState(10)
    const {data: coins, error, isLoading} = useSWR(
        `v1/cryptocurrency/listings/latest?start=${(pageIndex * limit) + 1}&limit=${limit}&convert=USD`, 
        fetcher
    )
    const {data: metrics, error: metricsError, isLoading: metricsLoading} = useSWR(
        "v1/global-metrics/quotes/latest",
        fetcher
    )
    const [totalCoins, setTotalCoins] = useState(metrics?.data?.data?.active_cryptocurrencies)
    const [favorites, setFavorites] = useState([])
 
    useEffect(()=>{
        setTotalCoins(metrics?.data?.data?.active_cryptocurrencies)
    },[metrics])
    
    const handleFavorites = (id) => {
        if(favorites.some(item => item == id)){
            setFavorites(prevItems => {
                return prevItems.filter(item => item != id)
            })
        } else {
            setFavorites([...favorites, id])
        }
    }

    return (
        <main>
            <section className='mt-8 mb-12 px-4 sm:px-8'>
                <h1 className='text-sm md:text-2xl font-bold mb-2'>Today&apos;s Cryptocurrency Prices by Market Cap</h1>
                <p className='text-sm'>The global cryptocurrency market cap today is $1.17 Trillion, a {!metricsLoading && <span className={metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}>{metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change.toFixed(1)}%</span>} change in the last 24 hours</p>
                {metricsLoading === false &&
                    <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3'>
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
            </section>
            <section className='px-4 sm:px-8 overflow-hidden'>
                <div className='relative overflow-x-scroll'>
                    <table className='text-sm border-collapse w-full mb-1 sm:mb-4'>
                        <thead className="sticky top-0 bg-white">
                            <tr className='border-y border-faded-grey'>
                                <th className='sticky-item left-0 cursor-pointer'></th>
                                <th className='sticky-item left-[34px] cursor-pointer'>#</th>
                                <th className='sticky-item left-[70px] cursor-pointer'>Name</th>
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
                                    const {id, name, quote, symbol, circulating_supply, slug} = coin
                                    const {price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h} = quote?.USD
                                    return(
                                        <tr className="border-b border-faded-grey" key={id}>
                                            <td onClick={()=>handleFavorites(id)} className='sticky-item left-0'>
                                                {favorites.some(item => item == id) ? <FaStar/> : <FaRegStar/>}
                                            </td>
                                            <td className='sticky-item left-[34px]'>{(pageIndex * limit) + (index + 1)}</td>
                                            <td className='sticky-item left-[70px] sm:whitespace-nowrap text-left'>
                                                <Link href={`/coins/${slug}`}>{name} <span className='text-dark-grey'>{symbol}</span></Link>
                                            </td>
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
                </div>
            </section>
            <div className='sm:hidden bg-news-grey py-5 grid place-content-center'>
                {!metricsLoading &&
                    <Pagination handleClick={setPageIndex} c={pageIndex} m={Math.ceil(totalCoins / limit)}/>    
                }
            </div>

            <div className='flex justify-between items-center mt-4 mb-10 px-4 sm:px-8'>
                <p className='text-sm sm:text-base'>Showing {(pageIndex * limit) + 1} - {(pageIndex + 1) * limit } </p>
                <div className='hidden sm:block'>
                    {!metricsLoading &&
                        <Pagination handleClick={setPageIndex} c={pageIndex} m={Math.ceil(totalCoins / limit)}/>    
                    }
                </div>
                <div className='text-sm flex items-center gap-1'>
                    <label htmlFor="selectrow" className='text-medium-grey text-sm sm:text-base'>Show rows</label>
                    <select className='focus:outline-none bg-faded-grey py-1.5 px-2 rounded text-black' name="limit" id="limit" value={limit} onChange={(e)=>setLimit(parseInt(e.target.value))}>
                        <option value="100">100</option>
                        <option value="50">50</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>

            <section className='bg-news-grey px-4 md:px-8 py-6 md:py-12 mb-12'>
                <article className='md:text-center md:border border-dark-grey p'>
                    <div className='md:w-3/5 mx-auto'>
                        <h1 className='pt-4 sm:pt-16 pb-2 text-sm sm:text-3xl font-semibold'>Be the first to know about every crypto news every day</h1>
                        <p className='mb-8 text-sm md:text-base'>Get crypto analysis, news and updates right to your inbox! Sign up here so you don&apos;t miss a single newsletter.</p>
                        <div className='flex flex-col md:flex-row items-center gap-4 mb-4 sm:mb-16'>
                            <input type='email' placeholder='Enter your email' className='bg-transparent w-full flex-1 border border-dark-grey py-3 px-6 text-sm' />
                            <button className='text-sm font-semibold text-white w-full md:w-fit bg-green-600 rounded-md py-3 px-6'>Subscribe now</button>
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
