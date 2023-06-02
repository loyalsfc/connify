import React from 'react'
import { Metadata } from 'next'
// import useSWR from 'swr'
import { fetcher, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Image from 'next/image'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import axios from 'axios'

export const metadata = {
    title: "BNB"
}

async function getData(slug){
    const res = await fetch(`http://192.168.0.192:5000/api/coin`, {
        method: "POST",
        body: JSON.stringify({slug}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    const coinData = await res.json()

    const metaDataRes = await fetch(`http://localhost:5000/api`, {
        method: "POST",
        body: JSON.stringify({url: `v2/cryptocurrency/info?slug=${slug}`}),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    const metadata = await metaDataRes.json()

    return {coinData, metadata: metadata.data[coinData.id]}
}

async function Page({params}) {
    const data = await getData(params.slug)
    console.log(data)

    const {logo, name, symbol} = data?.metadata
    const {quote} = data?.coinData

    return (
        <main className='py-6'>
            <section className='px-4 sm:px-8'>
                <article>
                    <div className='font-bold flex items-center gap-3'>
                        <Image
                            src={logo}
                            width={32}
                            height={32}
                            alt="Coin logo"
                        />
                        <h1 className='text-3xl'>{name}</h1>
                        <span className='text-sm py-0.5 px-1.5 bg-faded-grey text-medium-grey rounded'>{symbol}</span>
                    </div> 
                    <div className='flex gap-4 items-center'>
                        <h2 className='font-bold text-3xl text-black'>${numberToString(quote.USD.price)}</h2>
                        <span 
                            className={`border-md ${quote.USD.percent_change_24h > 0 ? "bg-green-500" :'bg-red-500'} text-white py-[5px] flex items-center font-medium gap-1 rounded-md px-2.5 text-sm'`}
                        >
                            {quote.USD.percent_change_24h > 0 ? <FaAngleUp /> : <FaAngleDown/>} {toTwoDecimalPlace(quote.USD.percent_change_24h)}% 
                        </span>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default Page
