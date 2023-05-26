import React from 'react'
import { Metadata } from 'next'
// import useSWR from 'swr'
import { fetcher } from '../../../../utils/utils'
import Image from 'next/image'
import { FaAngleDown } from 'react-icons/fa'
import axios from 'axios'

export const metadata = {
    title: "BNB"
}

async function getData(){
    const res = await fetch('https://jsonplaceholder.typicode.com/todos/1')
    return res.json()
}

async function Page({params}) {
    // const mainFetcher = (slug) => axios.post(`http://192.168.0.192:5000/api/coin`, {slug})
    // const {data: historyData, error: historyError} = useSWR(params.slug, mainFetcher)
    // const {data, isLoading, isError} = useSWR(
    //     `v2/cryptocurrency/info?slug=${params.slug}`,
    //     fetcher
    // )
    // console.log(data?.data)
    // console.log(historyData?.data)
    const data = await getData()
    console.log(data)
    return (
        <main className='py-6'>
            <section className='px-4 sm:px-8'>
                <article>
                    {/* <div className='font-bold flex items-center gap-3'>
                        <Image
                            src={data?.data?.data['1']?.logo}
                            width={32}
                            height={32}
                            alt="Coin logo"
                        />
                        <h1 className='text-3xl'>{data?.data?.data['1']?.name}</h1>
                        <span className='text-sm py-0.5 px-1.5 bg-faded-grey text-medium-grey rounded'>{data?.data?.data['1']?.symbol}</span>
                    </div>  */}
                    <div className='flex gap-4 items-center'>
                        <h2 className='font-bold text-3xl text-black'>$305.39</h2>
                        <span className='border-md bg-red-500 text-white py-[5px] flex items-center font-medium gap-1 rounded-md px-2.5 text-sm'><FaAngleDown/> 0.92% </span>
                    </div>
                </article>
                <div>

                </div>
            </section>
        </main>
    )
}

export default Page
