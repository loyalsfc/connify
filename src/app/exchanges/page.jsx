'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher, getExchangeImage } from '../../../utils/utils'
import Loader from '@/components/loader'
import Link from 'next/link'
import Image from 'next/image'

function Exchanges() {
    const {data: exchanges, error: exchangeError, isLoading: exchangeLoading} = useSWR(
        `v1/exchange/map?sort=volume_24h`,
        fetcher
    )
    const [limit, setLimit] = useState(101);

    if(exchangeLoading){
        return <Loader />
    }

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
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-center font-semibold py-8 text-sm'>
                    {
                        exchanges?.data?.data?.map((item, index) => {
                            if(index > limit) return;
                            return <Link href={`/exchanges/${item.slug}`} key={item.id}>
                                <div className='flex flex-col items-center gap-4 hover:bg-news-grey p-2 md:p-4 rounded-lg'>
                                    <Image
                                        src={getExchangeImage(item.id)}
                                        height={64}
                                        width={64}
                                        alt="Exchange logo"
                                        className='rounded-full'
                                    />
                                    <span className='hover:underline'>{item.name}</span>
                                </div>
                            </Link>
                        })
                    }
                </div>
                <div className='grid place-content-center py-2'>
                    <button 
                        className='disabled:opacity-40 bg-green-500 text-white font-bold text-xs py-2 px-4 rounded-md'
                        onClick={loadMore}
                        disabled={limit > exchanges?.length}
                    >
                        Load more
                    </button>
                </div>
            </section>
        </main>
    )
}

export default Exchanges