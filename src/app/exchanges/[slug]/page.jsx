'use client'

import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { fetcher, getImage, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Loader from '@/components/loader'
import Image from 'next/image'
import { FaAngleDown, FaAngleUp, FaComment, FaDollarSign, FaLink, FaTwitter, FaWallet } from 'react-icons/fa'
import Link from 'next/link'
import axios from 'axios'

function ExchangePage({params}) {
    const [showLess, setShowLess] = useState(true)
    const [assets, setAssets] = useState([])
    const [assetLimits, setAssetsLimit] = useState(19)
    const {data: meta, error: metaError, isLoading: metaLoading} = useSWR(
        `v1/exchange/info?slug=${params.slug}`,
        fetcher
    )
    
    useEffect(()=>{
        const url = `http://192.168.0.192:5000/api`
        if(meta){
            axios.post(url, {
                url: `v1/exchange/assets?id=${meta.data.data[params.slug]?.id}`
            })
            .then(({data}) => {
                setAssets(data?.data)
            })
        }
    },[meta])
    
    if(metaLoading){
        return <Loader />
    }

    const {id, logo, name, urls, spot_volume_usd, weekly_visits, description} = meta.data.data[params.slug]
    console.log(assets[0])

    const convertTextToHTML = (text) => {
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        let result;
        const parts = [];
      
        let lastIndex = 0;
        while ((result = linkRegex.exec(text))) {
            const linkText = result[1];
            const linkHref = result[2];
        
            parts.push(text.substring(lastIndex, result.index));
            parts.push({ linkText, linkHref });
        
            lastIndex = result.index + result[0].length;
        }
        parts.push(text.substring(lastIndex));
      
        return parts.map((part, index) => {
            if (typeof part === "object") {
                const { linkText, linkHref } = part;
                return (
                <Link href={linkHref ?? ""} key={index}>
                    <span className='text-blue-colour'>{linkText}</span>
                </Link>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

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
                    <div className=''>
                        <div className={showLess ? 'display-less' : ""}>
                            {
                                description.split('\n').map((item, index) => {
                                    if(item.includes('##')){
                                        return <h2 className='font-bold py-4' key={index}>{item.replace('##', '')}</h2>
                                    } else {
                                        return <p className='text-sm' key={index}>{convertTextToHTML(item)}</p>    
                                    }
                                })
                            }
                        </div>
                        <button onClick={()=>setShowLess(!showLess)} className='text-medium-grey sm:text-blue-colour bg-faded-grey sm:bg-transparent w-full mt-4 sm:w-fit grid place-content-center py-2 sm:py-3 rounded-md font-bold text-sm'>
                            {showLess ? <span className='flex items-center'> Show More <FaAngleDown /></span> : <span className='flex items-center'> Show Less <FaAngleUp    /></span>}
                        </button>
                    </div>
                </div>
            </section>
            <section className="px-4 sm:px-8 mb-8">
                <h2 className='font-semibold text-2xl mb-4'>Financial reserves</h2>
                <div className='bg-news-grey p-6 rounded-2xl relative w-fit'>
                    <table className=''>
                        <thead className='text-xs sticky top-0 border-y border-faded-grey'>
                            <tr>
                                <th className='py-2.5 bg-news-grey'>Token</th>
                                <th className='py-2.5 bg-news-grey'>Balance</th>
                                <th className='py-2.5 bg-news-grey'>Price</th>
                                <th className='py-2.5 bg-news-grey'>value</th>
                            </tr>
                        </thead>
                        <tbody className='text-sm font-semibold'>
                            {assets.map((item, index) =>{
                                if(index < assetLimits){
                                    const {crypto_id, price_usd, name, symbol} = item.currency
                                    console.log(price_usd)
                                    return <tr key={crypto_id} className='border-b border-faded-grey last:border-b-0'>
                                        <td className='flex items-center p-2.5 whitespace-nowrap'>
                                            <div className='relative'>
                                                <Image
                                                    src={getImage(crypto_id)}
                                                    height={24}
                                                    width={24}
                                                    alt='Icon'
                                                    className='rounded-full object-cover'
                                                />
                                                <Image
                                                    src={getImage(item.platform.crypto_id)}
                                                    height={16}
                                                    width={16}
                                                    alt='Exchange Icon'
                                                    className='absolute top-3.5 left-3.5 z-10 rounded-full object-cover'
                                                />
                                            </div>
                                            <p className='ml-4'>
                                                <span className="block text-sm font-semibold">{symbol}</span>
                                                <span className="flex items-center gap-3 text-medium-grey text-xs"><FaWallet /> {item.wallet_address}</span>
                                            </p>
                                        </td>
                                        <td className='text-end p-2.5'>{numberToString(item.balance)}</td>
                                        <td className='text-end p-2.5'>${toTwoDecimalPlace(price_usd)}</td>
                                        <td className='text-end p-2.5'>${toTwoDecimalPlace(price_usd * item.balance)}</td>
                                    </tr>
                                }
                            })}
                        </tbody>
                    </table>
                    <button onClick={()=>setAssetsLimit(assetLimits + 20)} className="w-full bg-faded-grey p-4 rounded-md text-center mt-4 font-bold">Load more</button>
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