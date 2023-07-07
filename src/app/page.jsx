'use client'

import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, getCoinVolume, getImage, numberToString, toTwoDecimalPlace } from '../../utils/utils'
import Pagination from '@/components/pagination'
import { FaRegStar, FaStar } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import PercentageChangeRow from '@/components/percentageChange'
import { useSearchParams  } from 'next/navigation'
import TableWrapper from '@/components/tableWrapper'
import NewsLetter from '@/components/newsLetter'
import { Context } from '@/context/context'

function Home() {
    const searchParams = useSearchParams()
    const pageSearchParam = searchParams.get('page')
    const [pageIndex, setPageIndex] = useState((pageSearchParam - 1) ?? 0)
    const [limit, setLimit] = useState(100)
    const {favorites, setFavorites} = useContext(Context)
    const {data: coins, error, isLoading} = useSWR(
        `v1/cryptocurrency/listings/latest?start=${(pageIndex * limit) + 1}&limit=${limit}&convert=USD`, 
        fetcher
    )
    const {data: metrics, error: metricsError, isLoading: metricsLoading} = useSWR(
        "v1/global-metrics/quotes/latest",
        fetcher
    )
    const [totalCoins, setTotalCoins] = useState(metrics?.data?.data?.active_cryptocurrencies)
    // const [favorites, setFavorites] = useState([])
 
    useEffect(()=>{
        setTotalCoins(metrics?.data?.data?.active_cryptocurrencies)
    },[metrics])

    useEffect(()=>{
        if(pageSearchParam){
            setPageIndex((pageSearchParam - 1) ?? 0);
        } else {
            setPageIndex(0)
        }
    }, [pageSearchParam])

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
            <TableWrapper isLoading={isLoading} data={coins?.data?.data} pageIndex={pageIndex} limit={limit} />
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
            <NewsLetter />
        </main>
    )
}

function CryptoInfo({title, submenu, borderColor}){
    return <li className={`p-4 overflow-hidden border-l-8 shadow rounded-lg ${borderColor}`}>
        <h3 className='truncate text-gray-900 text-xl font-medium inline-flex '>{title}</h3>
        <p className='text-sm text-dark-grey truncate font-medium'>{submenu}</p>
    </li>
}

export default Home
