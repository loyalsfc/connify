import React from 'react'
import { Metadata } from 'next'
// import useSWR from 'swr'
import { fetcher, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Image from 'next/image'
import { FaAngleDown } from 'react-icons/fa'
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

    // if(!res.ok){
    //     throw new Error('Failed to fetch data')
    // }

    return {coinData, metadata}
}

async function Page({params}) {
    console.log(params)

    // const mainFetcher = (slug) => axios.post(`http://192.168.0.192:5000/api/coin`, {slug})
    // const {data: historyData, error: historyError} = useSWR(params.slug, mainFetcher)
    // const {data, isLoading, isError} = useSWR(
    //     `v2/cryptocurrency/info?slug=${params.slug}`,
    //     fetcher
    // )
    // console.log(data?.data)
    // console.log(historyData?.data)
    const data = await getData(params.slug)
    
    console.log(data)
    return (
        <main className='py-6'>
            <section className='px-4 sm:px-8'>
                <article>
                    <div className='font-bold flex items-center gap-3'>
                        <Image
                            src={data?.metadata?.data['1']?.logo}
                            width={32}
                            height={32}
                            alt="Coin logo"
                        />
                        <h1 className='text-3xl'>{data?.coinData?.name}</h1>
                        <span className='text-sm py-0.5 px-1.5 bg-faded-grey text-medium-grey rounded'>{data?.coinData?.symbol}</span>
                    </div> 
                    <div className='flex gap-4 items-center'>
                        <h2 className='font-bold text-3xl text-black'>${numberToString(data?.coinData?.quote.USD.price)}</h2>
                        <span 
                            className='border-md bg-red-500 text-white py-[5px] flex items-center font-medium gap-1 rounded-md px-2.5 text-sm'
                        >
                            <FaAngleDown/> {toTwoDecimalPlace(data?.coinData?.quote.USD.percent_change_24h)}% 
                        </span>
                    </div>
                </article>
                <div>
                    {JSON.stringify(data)}
                </div>
            </section>
        </main>
    )
}

export default Page
