import React from 'react'
import {  fetchExchanges, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Image from 'next/image'
import { FaComment, FaDollarSign, FaLink, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'

import AboutExchange from '@/components/exchanges/exhangePage/aboutExchange'
import ExchangeAssets from '@/components/exchanges/exhangePage/exchangeAssets'
import AssetCharts from '@/components/exchanges/exhangePage/assetCharts'

async function getExchangeInfo(slug){
    const exchangeMetadata = await fetchExchanges(`v1/exchange/info?slug=${slug}`);
    const exchangeId = exchangeMetadata?.data[slug]?.id;
    const exchangeAssets = await fetchExchanges(`v1/exchange/assets?id=${exchangeId}`);
    return {exchangeMetadata, exchangeAssets};
}

export async function generateMetadata({params}, parent){
    const slug = params.slug;
    const exchangeMetadata = await fetchExchanges(`v1/exchange/info?slug=${slug}`);

    return {
        title: exchangeMetadata?.data[slug]?.name,
    }
}

async function ExchangePage({params}) {
    const {exchangeMetadata: meta, exchangeAssets: assets} = await getExchangeInfo(params.slug);

    const {id, logo, name, urls, spot_volume_usd, weekly_visits, description} = meta?.data[params.slug]

    return (
        <main>
            <section className='px-4 sm:px-8 py-8 pt-12 flex flex-wrap sm:flex-no gap-4 sm:gap-y-8 sm:gap-0'>                
                <article className='flex items-center gap-4 w-full sm:w-1/4'>
                    <div className='w-fit h-fit p-2 border border-medium-grey rounded'>
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
                <div className='flex flex-col sm:flex-row justify-between text-medium-grey w-full gap-4 sm:w-3/4'>
                    <p>
                        <span className='text-sm'>Spot Trading Volume(24h)</span>
                        <span className="block text-3xl text-[#222531] font-semibold">${toTwoDecimalPlace(spot_volume_usd)}</span>
                    </p>
                    <p>
                        <span className='text-sm'>Weekly Visit</span>
                        <span className='block text-3xl text-[#222531] font-semibold'>{numberToString(weekly_visits)}</span>
                    </p>
                </div>
                <div className='sm:pt-8 w-full sm:w-1/4'>
                    <Links Icon={FaLink} link={urls.website[0]} name={urls.website[0]} />
                    <Links Icon={FaComment} link={urls.chat[0]} name="Chat" />
                    <Links Icon={FaTwitter} link={urls.twitter[0]} name={`@${params.slug}`} />
                    <Links Icon={FaDollarSign} link={urls.fee[0]} name="Fees" />
                </div>
                <div className='text-medium-grey w-full sm:w-3/4'>
                    <h3 className='font-semibold text-xl sm:mt-8 mb-4'>About {name}</h3>
                    <AboutExchange description={description} />
                </div>
            </section>
            <section className="px-4 sm:px-8 mb-8">
                <h2 className='font-semibold text-2xl mb-4'>Financial reserves</h2>
                <div className='flex flex-col-reverse md:flex-row gap-8 items-start'>
                    <ExchangeAssets assets={assets?.data} />
                    <div className='bg-news-grey p-6 rounded-2xl w-full md:w-2/5'>
                        <h3 className="text-xl font-semibold mb-4">Token Allocation</h3>
                        <AssetCharts assets={assets?.data} />
                    </div>
                </div>
            </section>
        </main>
    )
}

function Links({Icon, link, name}){
    return <p className='flex gap-2 text-medium-grey items-center my-3 text-sm'>
        <Icon /> 
        <span className='text-blue-colour font-medium'>
            <Link href={link ?? ""}>{name}</Link>
        </span>
    </p>

}

export default ExchangePage