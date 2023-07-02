'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {FaBars, FaSearch, FaTimes, FaUser} from "react-icons/fa"
import { fetcher } from '../../utils/utils'
import useSWR from 'swr'
import { numberToString } from '../../utils/utils'
import Logo from './Logo'
import { usePathname } from 'next/navigation'
import { Context } from '../context/context'
import { supabase } from '@/lib/supabaseClient'

function Header() {
    const {data: metrics, error: metricsError, isLoading: metricsLoading} = useSWR(
        "v1/global-metrics/quotes/latest",
        fetcher
    )
    const {setShowAuthModal, user} = useContext(Context)
    const mobileMenu = useRef(null)
    const menu = useRef(null)
    const menuBtn = useRef(null)
    const pathname = usePathname()
    const [showMenu, setShowMenu] = useState(false)

    const toggleMenu = (from, to) => {
        mobileMenu.current.classList.replace(from, to);
    }

    const signOut = async() => {
        const { error } = await supabase.auth.signOut()
        setShowMenu(false)
    }

    useEffect(() => {
        toggleMenu('left-0', '-left-full')
    }, [pathname]);

    useEffect(()=>{
        const handleClick = (e) => {
            if(menu.current && !menu.current.contains(e.target) && !menuBtn.current.contains(e.target) ){
                setShowMenu(false)
            }
        }

        document.addEventListener('click', handleClick)

        return () => {
            document.removeEventListener('click', handleClick)
        }
    },[])

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
                        value={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_market_cap)) ?? ""}`}
                    />
                    <Listing 
                        title="24h Vol"
                        value={`$${numberToString(Math.floor(metrics?.data?.data?.quote?.USD.total_volume_24h)) ?? ""}`}
                    />
                    <Listing 
                        title="Dominance"
                        value={`BTC: ${metrics?.data?.data?.btc_dominance.toFixed(1) ?? ""}% 
                            ETH: ${metrics?.data?.data?.eth_dominance.toFixed(1) ?? ""}%
                        `}
                    />
                </div>
                {user? 
                    <div className='py-2 relative'>
                        <button ref={menuBtn} onClick={()=>setShowMenu(!showMenu)}><FaUser /></button>
                        {showMenu && <div ref={menu} className='absolute right-0 bg-white shadow-xl rounded-md overflow-hidden border border-faded-grey'>
                            <ul className='py-2'>
                                <li className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'><Link href="/portfolio">Portfolio</Link></li>
                                <li className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'><Link href="/watchlist">Watchlist</Link></li>
                                <li onClick={signOut} className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'>Logout</li>
                            </ul>
                        </div>}
                    </div>:<div className='hidden gap-3 text-center lg:flex'>
                    <button onClick={()=>setShowAuthModal({isShown: true, type: 'login'})} className='auth-btn text-green-400' href="">Login</button>
                    <button onClick={()=>setShowAuthModal({isShown: true, type: 'sign-up'})} className='auth-btn bg-green-400 text-white' href="">Sign Up</button>
                </div>
                }
            </div>
            <div className='header-item gap-6 py-2 lg:py-4'>
                <Link href="/"><Logo /></Link>
                <nav className='hidden lg:block' >
                    <Navigations/>
                </nav>
                <div className='ml-auto hidden lg:block'>
                    <ul className='flex gap-4 items-center'>
                        <li>Watchlist</li>
                        <li>
                            <Link href="/portfolio">
                                Portfolio
                            </Link>
                        </li>
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
                <button onClick={()=>toggleMenu('-left-full', 'left-0')} className='block text-2xl lg:hidden'>
                    <FaBars />
                </button>
            </div>
            <div ref={mobileMenu} className="h-screen bg-white lg:hidden w-full z-[49] fixed -left-100 -left-full top-0 transition-all">
                <div className='header-item py-2 shadow-lg'>
                    <Link href="/"><Logo /></Link>
                    <button onClick={()=>toggleMenu('left-0', '-left-full')} className='ms-auto'><FaTimes /></button>
                </div>
                <div className='px-4 pt-8'>
                    <Navigations />
                    {!user ? <div className='gap-3 text-center flex flex-col-reverse mt-8'>
                        <button 
                            onClick={()=>setShowAuthModal({isShown: true, type: 'login'})}  
                            className='w-full text-sm rounded-md py-2.5 font-bold border border-green-400 text-green-400' 
                        >
                            Login
                        </button>
                        <button 
                            onClick={()=>setShowAuthModal({isShown: true, type: 'sign-up'})} 
                            className='w-full text-sm rounded-md py-2.5 font-bold bg-green-400 text-white' 
                        >
                            Sign Up
                        </button>
                    </div> : <div className='p-4'><FaUser/></div>}
                </div>
               
            </div>
        </header>
    )
}

function Navigations(){
    return(
        <ul className='flex flex-col lg:flex-row gap-4 nav-menu'>
            <li>
                <Link href="/">
                    Cryptocurrencies
                </Link>
            </li>
            <li>
                <Link href="/exchanges">
                    Exchange
                </Link>
            </li>
            <li>
                <Link href="/trade-calculator">
                    Trade Caculator
                </Link>
            </li>
            <li>
                <Link href="/converter">
                    Converter
                </Link>
            </li>
            <li className='lg:hidden'>Watchlist</li>
            <li className='lg:hidden'>
                <Link href="/portfolio">
                    Portfolio
                </Link>
            </li>
        </ul>
    )
}

function Listing({title, value}){
    return <p className='text-xs font-medium shrink-0'>
        <span className='text-[#616E85]'>{title}: </span>
        <span className='text-blue-colour'>{value}</span>
    </p>
}

export default Header
