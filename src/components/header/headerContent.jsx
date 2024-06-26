'use client'

import React, { useContext, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { FaAngleUp, FaBars, FaSearch, FaTimes, FaUser} from "react-icons/fa"
import { numberToString } from '../../../utils/utils'
import Logo from '../Logo'
import { usePathname } from 'next/navigation'
import { Context } from '../../context/context'
import { supabase } from '@/lib/supabaseClient'
import Search from '../search'

function HeaderContent({metrics, exchanges}) {
    const {setShowAuthModal, user} = useContext(Context)
    const mobileMenu = useRef(null)
    const menu = useRef(null)
    const menuBtn = useRef(null)
    const searchBox = useRef(null)
    const searchInput = useRef(null)
    const mobileSearchBtn = useRef(null)
    const pathname = usePathname()
    const [showMenu, setShowMenu] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    
    const toggleMenu = (from, to) => {
        mobileMenu.current.classList.replace(from, to);
    }

    const signOut = async() => {
        const { error } = await supabase.auth.signOut()
        setShowMenu(false)
    }

    useEffect(() => {
        toggleMenu('left-0', '-left-full');
        setShowMenu(false);
        setShowSearch(false);
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

    useEffect(()=>{
        const closeSearch = (e) => {
            if(searchBox.current && !searchBox.current.contains(e.target) && searchInput.current != e.target && !mobileSearchBtn.current.contains(e.target)){
                setShowSearch(false)
            }
        }

        document.addEventListener('click', closeSearch)

        return ()=>{
            document.removeEventListener('click', closeSearch)
        }
    },[])

    const showMobileDropdown = (e) => {
        e.currentTarget.nextElementSibling.classList.toggle('hidden')
        e.currentTarget.lastElementChild.classList.toggle('rotate-180')
    }

    return (
        <>
            <div className='header-item justify-between py-2'>
                <div className='flex gap-4 overflow-x-scroll'>
                    <Listing 
                        title="Cryptos"
                        value={numberToString(metrics?.total_cryptocurrencies)}
                    />
                    <Listing 
                        title="Exchanges"
                        value={metrics?.active_exchanges}
                    />
                    <Listing 
                        title="Market Cap"
                        value={`$${numberToString(Math.floor(metrics?.quote?.USD.total_market_cap)) ?? ""}`}
                    />
                    <Listing 
                        title="24h Vol"
                        value={`$${numberToString(Math.floor(metrics?.quote?.USD.total_volume_24h)) ?? ""}`}
                    />
                    <Listing 
                        title="Dominance"
                        value={`BTC: ${metrics?.btc_dominance.toFixed(1) ?? ""}% 
                            ETH: ${metrics?.eth_dominance.toFixed(1) ?? ""}%
                        `}
                    />
                </div>
                {user? 
                    <div className='py-2 relative hidden md:block'>
                        <button ref={menuBtn} onClick={()=>setShowMenu(!showMenu)}><FaUser /></button>
                        {showMenu && <div ref={menu} className='absolute right-0 bg-white shadow-xl z-50 rounded-md overflow-hidden border border-faded-grey'>
                            <DropMenu signOut={signOut} />
                        </div>}
                    </div>:<div className='hidden gap-3 text-center lg:flex'>
                    <button onClick={()=>setShowAuthModal({isShown: true, type: 'login'})} className='auth-btn text-green-400' href="">Login</button>
                    <button onClick={()=>setShowAuthModal({isShown: true, type: 'sign-up'})} className='auth-btn bg-green-400 text-white' href="">Sign Up</button>
                </div>
                }
            </div>
            <div className='header-item gap-6 py-2 lg:py-4 relative'>
                <Link href="/"><Logo /></Link>
                <nav className='hidden lg:block' >
                    <Navigations path={pathname}/>
                </nav>
                <div className='ml-auto hidden lg:block'>
                    <ul className='flex gap-4 items-center'>
                        <li>
                            <Link 
                                href="/watchlist" 
                                className={`headernavs ${pathname.includes("/watchlist") && "border-b-4"}`}
                            >
                                Watchlist
                            </Link>
                        </li>
                        <li>
                            <Link 
                                href="/portfolio"
                                className={`headernavs ${pathname.includes("/portfolio") && "border-b-4"}`}
                            >
                                Portfolio
                            </Link>
                        </li>
                        <li>
                            <div className='flex items-center gap-3 bg-faded-grey p-2 rounded-md'>
                                <label htmlFor='search'><FaSearch /></label>
                                <div 
                                    className='bg-transparent  w-44'
                                    onClick={()=>setShowSearch(true)}
                                    ref={searchInput}
                                >Search</div>
                            </div>
                        </li>
                    </ul>
                </div>
                {showSearch && <div ref={searchBox}><Search close={setShowSearch} exchanges={exchanges} /></div>}
                <button ref={mobileSearchBtn} onClick={()=>setShowSearch(true)} className='ml-auto text-2xl block lg:hidden'>
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
                    <Navigations path={pathname} />
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
                    </div> : (
                    <div className=''>
                        <p onClick={(e)=>showMobileDropdown(e)} className='py-4 flex items-center border-b border-medium-grey/50'>
                            <span className='flex items-center gap-3'><FaUser/> My Account</span>
                            <button className='ml-auto rotate-180'><FaAngleUp /></button>
                        </p>
                        <div className='hidden'>
                            <DropMenu signOut={signOut} />
                        </div>
                    </div>)}
                </div>
            </div>
        </>
    )
}

function Navigations({path}){
    return(
        <ul className='flex flex-col lg:flex-row gap-4 nav-menu'>
            <li>
                <Link 
                    href="/" 
                    className={`${path === "/" && "border-b-4"} headernavs`}
                >
                    Cryptocurrencies
                </Link>
            </li>
            <li>
                <Link 
                    href="/exchanges" 
                    className={`${path.includes("/exchanges") && "border-b-4"} headernavs`}
                >
                    Exchange
                </Link>
            </li>
            <li>
                <Link 
                    href="/trade-calculator" 
                    className={`${path.includes("/trade-calculator") && "border-b-4"} headernavs`}
                >
                    Trade Caculator
                </Link>
            </li>
            <li>
                <Link 
                    href="/converter" 
                    className={`${path.includes("/converter") && "border-b-4"} headernavs`}
                >
                    Converter
                </Link>
            </li>
            <li className='lg:hidden'>
                <Link 
                    href="/watchlist" 
                    className='hover:underline hover:text-green-400 border-b py-2 border-b-green-400'
                >
                    Watchlist
                </Link></li>
            <li className='lg:hidden'>
                <Link 
                    href="/portfolio" 
                    className='hover:underline hover:text-green-400 border-b py-2 border-b-green-400'
                >
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

function DropMenu({signOut}){
    return(
        <ul className='py-2'>
            <li className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'><Link href="/portfolio">Portfolio</Link></li>
            <li className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'><Link href="/watchlist">Watchlist</Link></li>
            <li onClick={signOut} className='py-2 px-4 hover:bg-faded-grey pr-16 cursor-pointer'>Logout</li>
        </ul>
    )
}

export default HeaderContent