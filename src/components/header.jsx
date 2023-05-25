'use client'

import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import {FaBars, FaHamburger, FaSearch} from "react-icons/fa"
import axios from 'axios'
import { fetcher } from '../../utils/utils'
import useSWR from 'swr'
import { numberToString } from '../../utils/utils'
import Logo from './Logo'

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
        <header className='flex flex-col-reverse lg:flex-col'>
            <div className='header-item justify-between py-2'>
                <div className='flex gap-4 overflow-x-scroll'>
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
                <div className='hidden gap-3 text-center lg:flex'>
                    <Link className='auth-btn text-green-400' href="">Login</Link>
                    <Link className='auth-btn bg-green-400 text-white' href="">Sign Up</Link>
                </div>
            </div>
            <div className='header-item gap-6 py-2 lg:py-4'>
                <Logo />
                <nav className='hidden lg:block' >
                    <ul className='flex gap-4'>
                        <li>Cryptocurrencies</li>
                        <li>Exchange</li>
                        <li>Learn Crypto</li>
                        <li>NFT</li>
                        <li>Products</li>
                    </ul>
                </nav>
                <div className='ml-auto hidden lg:block'>
                    <ul className='flex gap-4 items-center'>
                        <li>Watchlist</li>
                        <li>PortFolio</li>
                        <li>
                            <div className='flex items-center gap-3 bg-faded-grey p-2 rounded-md'>
                                <FaSearch />
                                <input placeholder='Search' className='bg-transparent focus:outline-none'/>
                            </div>
                        </li>
                    </ul>
                </div>
                <button className='ml-auto text-2xl block lg:hidden'>
                    <FaSearch />
                </button>
                <button className='block text-2xl lg:hidden'>
                    <FaBars />
                </button>
            </div>
        </header>
    )
}

function Listing({title, value}){
    return <p className='text-xs font-medium shrink-0'>
        <span className='text-[#616E85]'>{title}: </span>
        <span className='text-[#3861FB]'>{value}</span>
    </p>
}

export default Header
