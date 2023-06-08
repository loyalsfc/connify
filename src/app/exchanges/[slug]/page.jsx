'use client'

import React, { useState } from 'react'
import useSWR from 'swr'
import { fetcher, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Loader from '@/components/loader'
import Image from 'next/image'
import { FaAngleDown, FaAngleUp, FaComment, FaDollarSign, FaLink, FaTwitter } from 'react-icons/fa'
import Link from 'next/link'

function ExchangePage({params}) {
    const [showLess, setShowLess] = useState(true)
    const [assetLimits, setAssetsLimit] = useState(19)
    const {data: meta, error: metaError, isLoading: metaLoading} = useSWR(
        `v1/exchange/info?slug=${params.slug}`,
        fetcher
    )
    
    const {data: asset, error: assetError, isLoading: assetLoading} = useSWR(
        `v1/exchange/assets?id=${meta?.id}`,
        fetcher
    )
    
    if(metaLoading || assetLoading){
        return <Loader />
    }

    const {id, logo, name, urls, spot_volume_usd, weekly_visits, description} = meta.data.data[params.slug]
    console.log(asset)

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