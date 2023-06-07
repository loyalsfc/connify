'use client'

import React from 'react'
import useSWR from 'swr'
import { fetcher } from '../../../../utils/utils'
import Loader from '@/components/loader'
import Image from 'next/image'
import { FaComment, FaDollarSign, FaLink, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'

function ExchangePage({params}) {
    const {data: meta, error: metaError, isLoading: metaLoading} = useSWR(
        `v1/exchange/info?slug=${params.slug}`,
        fetcher
    )
    
    if(metaLoading){
        return <Loader />
    }

    const {logo, name, urls, spot_volume_usd, weekly_visits, description} = meta.data.data[params.slug]
    console.log(meta.data.data[params.slug])
    return (
        <main>
            <section className='px-4 sm:px-8 py-8'>
                <aside>
                    <article className='flex items-center gap-4'>
                        <div className='w-fit p-2 border border-medium-grey rounded'>
                            <Image 
                                src={logo}
                                height="40"
                                width="40"
                                alt="Exchange Logo"
                            />
                        </div>
                        <h1 className='flex flex-col justify-between'>
                            <span className='font-bold text-2xl'>{name}</span>
                            <span className='tag'>Centralized</span>
                        </h1>
                    </article>
                    <div className='pt-8'>
                        <Links Icon={FaLink} link={urls.website[0]} />
                        <Links Icon={FaComment} link="Chat" />
                        <Links Icon={FaTwitter} link={`@${params.slug}`} />
                        <Links Icon={FaDollarSign} link="Fees" />
                    </div>
                </aside>
                <article>
                    
                </article>
            </section>
        </main>
    )
}

function Links({Icon, link}){
    return <p className='flex gap-2 items-center my-0.5 hover:text-blue-500 font-semibold text-sm'><Icon /> <Link href={link}>{link}</Link></p>

}

export default ExchangePage