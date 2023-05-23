'use client'

import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import {FaSearch} from "react-icons/fa"
import axios from 'axios'
import { fetcher } from '../../utils/utils'
import useSWR from 'swr'
import { numberToString } from '../../utils/utils'

function Header() {
    const {data: metrics, error, isLoading} = useSWR("global-metrics", fetcher)

    // axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD', {
    //             headers: {
    //                 'X-CMC_PRO_API_KEY': '337af67c-9bf9-475b-84e8-c66530ad73f0',
    //             },
    //     })
    //     .then(function (response) {
    //         // handle success
    //         console.log(response);
    //     })
    //     .catch(function (error) {
    //         // handle error
    //         console.log(error);
    //     })
    //     .finally(function () { 
    //         // always executed
    //     });

    // const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD', {
    //         headers: {
    //             'X-CMC_PRO_API_KEY': '337af67c-9bf9-475b-84e8-c66530ad73f0',
    //         },
    // });

    return (
        <header className=''>
            <div className='header-item justify-between py-2'>
                <div className='flex gap-4'>
                    <Listing 
                        title="Cryptos"
                        value={numberToString(metrics?.data?.data?.total_cryptocurrencies)}
                    />
                    <Listing 
                        title="Exchanges"
                        value={metrics?.data?.data?.active_exchanges}
                    />
                    <Listing 
                        title="Market Cap"
                        value={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_market_cap))}`}
                    />
                    <Listing 
                        title="24h Vol"
                        value={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_volume_24h))}`}
                    />
                    <Listing 
                        title="Dominance"
                        value={`BTC: ${metrics?.data?.data?.btc_dominance.toFixed(1)}% 
                            ETH: ${metrics?.data?.data?.eth_dominance.toFixed(1)}%
                        `}
                    />
                </div>
                <div className='flex gap-3'>
                    <Link className='auth-btn text-green-400' href="">Login</Link>
                    <Link className='auth-btn bg-green-400 text-white' href="">Sign Up</Link>
                </div>
            </div>
            <div className='header-item gap-6'>
                <h1 className='flex items-center font-bold text-2xl gap-2'>
                    <Image
                        src="/logo.jpg"
                        height="40"
                        width="40"
                        alt="Logo"
                    />
                    Coinnify 
                </h1>
                <nav>
                    <ul className='flex gap-4'>
                        <li className='py-6'>Cryptocurrencies</li>
                        <li className='py-6'>Exchange</li>
                        <li className='py-6'>Learn Crypto</li>
                        <li className='py-6'>NFT</li>
                        <li className='py-6'>Products</li>
                    </ul>
                </nav>
                <div className='ml-auto'>
                    <ul className='flex gap-4 items-center'>
                        <li className='py-6'> Watchlist</li>
                        <li className='py-6'>  PortFolio</li>
                        <li>
                            <div className='flex items-center gap-3 bg-faded-grey p-2 rounded-md'>
                                <FaSearch />
                                <input placeholder='Search' className='bg-transparent focus:outline-none'/>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    )
}

function Listing({title, value}){
    return <p className='text-xs font-medium'>
        <span className='text-[#616E85]'>{title}: </span>
        <span className='text-[#3861FB]'>{value}</span>
    </p>
}

export default Header
