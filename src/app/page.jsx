'use client'

import React from 'react'
import axios from 'axios'
import useSWR from 'swr'
import { ExpandLess, ExpandMore, StarRateOutlined } from '@mui/icons-material'
import { fetcher, getCoinVolume, numberToString, toTwoDecimalPlace } from '../../utils/utils'

function Home() {
    const {data: coins, error, isLoading} = useSWR("list", fetcher)
    const {data: metrics, error: metricsError, isLoading: metricsLoading} = useSWR("global-metrics", fetcher)
    
    return (
        <main>
            <div className='mt-8 mb-12 px-8'>
                <h1 className='text-2xl font-bold mb-2'>Today's Cryptocurrency Prices by Market Cap</h1>
                <p className='text-sm'>The global cryptocurrency market cap today is $1.17 Trillion, a -0.3% change in the last 24 hours</p>
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
            <div className='px-8 relative'>
                <table className='text-sm mx-auto w-full'>
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
                                        <td className='p-2.5'>{index + 1}</td>
                                        <td className='p-2.5 text-left'>{name} {symbol}</td>
                                        <td className='p-2.5 text-right'>${price.toFixed(2)}</td>
                                        <PercentageChangeRow percentChange={percent_change_1h} />
                                        <PercentageChangeRow percentChange={percent_change_24h} />
                                        <PercentageChangeRow percentChange={percent_change_7d} />
                                        <td className='p-2.5'>${toTwoDecimalPlace(market_cap)}</td>
                                        <td className='p-2.5 text-right'>
                                            ${toTwoDecimalPlace(volume_24h)} <br/>
                                            <span className='text-xs text-[#586667E]'>{getCoinVolume(volume_24h, price)} {symbol}</span>
                                        </td>
                                        <td className='p-2.5 text-right'>{numberToString(Math.floor(circulating_supply))} {symbol}</td>
                                    </tr>
                                )
                            })

                        }
                    </tbody>
                </table>
            </div>
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
