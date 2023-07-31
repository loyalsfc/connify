'use client'

import Image from 'next/image'
import React, { useRef, useState } from 'react'
import { FaCheckCircle, FaRegCopy, FaWallet } from 'react-icons/fa'
import { getImage, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'

function ExchangeAssets({assets}) {
    const notification = useRef()
    const [assetLimits, setAssetsLimit] = useState(19)
    
    function truncateContactAddress(address){
        const prefix = address.slice(0, 6)
        const suffix = address.slice(-6)
        return prefix + "..." + suffix
    }   

    function copyAddress(e){
        navigator.clipboard.writeText(e.currentTarget.getAttribute('data-contact-address'))
        notification.current.classList.remove('scale-0');
        setTimeout(()=>{
            notification.current.classList.add('scale-0');
        }, 5000)
    }

    return (
        <div className='bg-news-grey p-4 md:p-6 rounded-2xl overflow-scroll relative w-full  md:w-3/5 shrink-0'>
            <p ref={notification} className='bg-[#000000B3] flex gap-2 py-2.5 px-4 w-fit items-center rounded-md text-white fixed z-20 top-[10%] scale-0 left-1/2 -translate-x-1/2'>
                <span className='text-green-500'><FaCheckCircle/></span>
                Copied
            </p>
            <table className='table w-full'>
                <thead className='text-xs sticky top-0 border-y border-faded-grey bg-news-grey'>
                    <tr >
                        <th className='py-2.5 z-10 top-0 bg-news-grey sticky left-0'>Token</th>
                        <th className='py-2.5 sticky top-0 bg-news-grey'>Balance</th>
                        <th className='py-2.5 sticky top-0 bg-news-grey'>Price</th>
                        <th className='py-2.5 sticky top-0 bg-news-grey'>value</th>
                    </tr>
                </thead>
                <tbody className='text-sm font-semibold'>
                    {assets?.length ? assets?.map((item, index) =>{
                        if(index < assetLimits){
                            const {crypto_id, price_usd, name, symbol} = item.currency
                            return <tr key={index} className='border-b border-faded-grey last:border-b-0'>
                                <td className='flex items-center sticky left-0 p-2.5 whitespace-nowrap bg-news-grey'>
                                    <div className='relative shrink-0'>
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
                                        <span 
                                            className="flex items-center gap-2 text-medium-grey text-xs contact-address-wrapper"
                                            data-contact-address = {item.wallet_address}
                                            onClick={copyAddress}
                                        >
                                            <FaWallet /> {truncateContactAddress(item.wallet_address)} <span className='copy-icon'><FaRegCopy/></span>
                                        </span>
                                    </p>
                                </td>
                                <td className='text-end p-2.5'>{numberToString(item.balance)}</td>
                                <td className='text-end p-2.5'>${toTwoDecimalPlace(price_usd)}</td>
                                <td className='text-end p-2.5'>${toTwoDecimalPlace(price_usd * item.balance)}</td>
                            </tr>
                        }
                    }):<tr>
                        <td className='text-center italic py-20' colSpan={4}>No Data to show</td>
                    </tr>
                    }
                </tbody>
            </table>
            <p className='mt-2 text-xs font-semibold text-medium-grey sticky left-0'>Only wallets with {'>'}500,000 USD balance are shown <br/>
                * Balances from these wallets may be delayed</p>
            <button onClick={()=>setAssetsLimit(assetLimits + 20)} className="w-full bg-faded-grey p-4 rounded-md text-center mt-4 sticky left-0 font-bold">Load more</button>
        </div>
    )
}

export default ExchangeAssets