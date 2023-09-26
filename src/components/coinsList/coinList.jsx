'use client'

import React from 'react'
import TableWrapper from '@/components/tableWrapper'
import { numberToString } from '../../../utils/utils'

function CoinList({coins, metrics}) {
    return (
        <>
            <section className='mt-8 mb-12 px-4 sm:px-8'>
                <h1 className='text-sm md:text-2xl font-bold mb-2'>Today&apos;s Cryptocurrency Prices by Market Cap</h1>
                <p className='text-sm'>
                    The global cryptocurrency market cap today is $1.17 Trillion, a 
                    <span 
                        className={metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}>
                            {metrics?.data?.data?.quote?.USD.total_market_cap_yesterday_percentage_change.toFixed(1)}%
                        </span> 
                    change in the last 24 hours
                </p>
                
                <ul className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-3'>
                    <CryptoInfo 
                        title={`$${numberToString(Math.floor(metrics?.data?.quote?.USD.total_market_cap))}`}
                        submenu="Market Capitalization"
                        borderColor={metrics?.data?.quote?.USD.total_market_cap_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}
                    />
                    <CryptoInfo 
                        title={`$${numberToString(Math.floor(metrics?.data?.quote?.USD.total_volume_24h))}`}
                        submenu="24h Trading Volume"
                        borderColor={metrics?.data?.quote?.USD.total_volume_24h_yesterday_percentage_change > 0 ? "border-green-400" : "border-red-500"}
                    />
                    <CryptoInfo 
                        title={`${metrics?.data?.btc_dominance.toFixed(1)}%`}
                        submenu="Bitcoin Market Cap Dominance"
                        borderColor="border-gray-300"
                    />
                    <CryptoInfo 
                        title={numberToString(metrics?.data?.total_cryptocurrencies)}
                        submenu="# of Coins"
                        borderColor="border-gray-300"
                    />
                </ul>
            </section>
            <TableWrapper isLoading={false} data={coins?.data} />
        </>
    )
}

function CryptoInfo({title, submenu, borderColor}){
    return <li className={`p-4 overflow-hidden border-l-8 shadow rounded-lg ${borderColor}`}>
        <h3 className='truncate text-gray-900 text-xl font-medium inline-flex '>{title}</h3>
        <p className='text-sm text-dark-grey truncate font-medium'>{submenu}</p>
    </li>
}

export default CoinList