import { Context } from '@/context/context'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaSearch, FaTimesCircle } from 'react-icons/fa'
import useSWR from 'swr'
import { fetcher, getExchangeImage, getImage } from '../../utils/utils'
import Link from 'next/link'
import Image from 'next/image'

function Search({close, exchanges}) {
    const searchRef = useRef(null);
    const [searchQuary, setSearchQuary] = useState('')
    const {coins} = useContext(Context)

    useEffect(()=>{
        searchRef.current?.focus();
    },[])

    function filter(item){
        return item.name.toLowerCase().includes(searchQuary) || item?.symbol?.toLowerCase().includes(searchQuary)
    }

    return (
        <section className='w-full h-screen md:h-fit md:max-h-[450px] flex flex-col md:overflow-hidden md:max-w-[400px] bg-white z-[501] top-0 md:top-4 pb-4 rounded-md border border-faded-grey absolute right-0 md:right-8 shadow-xl'>
            <div className='py-5 md:py-4 p-4 flex items-center gap-2 shadow-md md:shadow-none mb-4 md:mb-0'>
                <FaSearch className='opacity-50'/> 
                <input
                    type="text" 
                    className='focus:outline-none flex-1' 
                    value={searchQuary}
                    onChange={(e)=>setSearchQuary(e.target.value.toLocaleLowerCase())}
                    placeholder='search coins and exchanges'
                    ref={searchRef}
                />
                <button onClick={()=>close(false)}>
                    <FaTimesCircle className='opacity-50' />
                </button>
            </div>
            <div className="overflow-scroll flex-1">
                <div>
                    {coins?.data?.data?.data?.filter(filter).length !== 0 &&<div>
                        <h4 className='opacity-50 text-xs mb-2 px-4'>Crytocurrencies</h4>
                        <ul>{coins?.data?.data?.data.filter(filter).map((item, index) => {
                                if(index > 5) return;
                                return(
                                    <li key={item.id} className='p-2 px-4 hover:bg-faded-grey cursor-pointer'>
                                        <Link href={`/coins/${item.slug}`} className='flex justify-between'>
                                            <p className='flex items-center gap-2'>
                                                <Image
                                                    src={getImage(item.id)}
                                                    height={20}
                                                    width={20}
                                                    alt="Coin logo"
                                                />
                                                <span className='opacity-50'>{item.name} ({item.symbol})</span>
                                            </p>
                                            <span className='opacity-50'>#{item.rank}</span>
                                        </Link>
                                    </li>)})}
                        </ul>
                    </div>}
                    {searchQuary !== "" && exchanges?.filter(filter).length !== 0 && <div className='mt-4'>
                        <h4 className="opacity-50 text-xs mb-2 px-4">Exchanges</h4>
                        <ul>{exchanges?.filter(filter).map((item, index) => {
                            if(index > 5) return;
                            return(
                                <li key={item.id} className="p-2 px-4 hover:bg-faded-grey cursor-pointer">
                                    <Link href={`/exchanges/${item.slug}`} className='flex justify-between'>
                                        <p className="flex items-center gap-2">
                                            <Image
                                                src={getExchangeImage(item.id)}
                                                height={20}
                                                width={20}
                                                alt='Exchange logo'
                                            />
                                            <span className="opacity-500">{item.name}</span>
                                        </p>
                                        <span className="opacity-500">#{item.id}</span>
                                    </Link>
                                </li>
                            )})}
                        </ul>
                    </div>}
                    {exchanges?.filter(filter).length === 0 && coins?.data?.data?.data.filter(filter).length === 0 &&
                        <div>
                            <article className='text-center py-16'>
                                <span className='text-5xl opacity-50 block w-fit mx-auto'><FaSearch /></span>
                                <p className='mt-3'>No Results Found for {searchQuary}</p>
                            </article>
                        </div>}
                </div>
            </div>
        </section>
    )
}

export default Search