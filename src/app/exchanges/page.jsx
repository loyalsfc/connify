'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher } from '../../../utils/utils'
import Loader from '@/components/loader'
import Link from 'next/link'

function Exchanges() {
    const {data: exchanges, error: exchangeError, isLoading: exchangeLoading} = useSWR(
        `v1/exchange/map`,
        fetcher
    )
    const [limit, setLimit] = useState(101);

    if(exchangeLoading){
        return <Loader />
    }

    console.log(exchanges)

    const loadMore = () => {
        if(limit > exchanges.length) return;
        setLimit(limit + 102)
    }

    return (
        <main>
            <section className='mt-8 mb-12 px-4 sm:px-8'>
                <h1 className='text-sm md:text-2xl font-bold mb-2'>Top Crypto Exchanges Ranked by Trust Score</h1>
                <p className='text-sm'>As of today, we track 679 crypto exchanges with a total 24h trading volume of $56.8 Billion, a -2.66% change in the last 24 hours. Currently, the 3 largest cryptocurrency exchanges are Binance, Coinbase Exchange, and Bybit. Total tracked crypto exchange reserves currently stands at $105 Billion</p>
                <h4 className="text-center text-2xl font-bold mt-8">Exchanges</h4>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-8 text-center font-semibold py-8 text-sm'>
                    {
                        exchanges?.data?.data?.map((item, index) => {
                            if(index > limit) return;
                            return <Link href={`/exchanges/${item.slug}`} key={item.id}>
                                <span className='hover:underline'>{item.name}</span>
                            </Link>
                        })
                    }
                </div>
                <div className='grid place-content-center py-2'>
                    <button 
                        className='disabled:opacity-40 bg-green-500 text-white font-bold text-xs py-2 px-4 rounded-md'
                        onClick={loadMore}
                        disabled={limit > exchanges.length}
                    >
                        Load more
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Exchanges