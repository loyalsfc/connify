'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getExchangeImage } from '../../../utils/utils';


function ExchangeContent({exchanges}) {
    const [limit, setLimit] = useState(101);

    const loadMore = () => {
        if(limit > exchanges?.length) return;
        setLimit(limit + 102)
    }

    return (
        <>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 text-center font-semibold py-8 text-sm'>
                {
                    exchanges?.map((item, index) => {
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
        </>
    )
}

export default ExchangeContent