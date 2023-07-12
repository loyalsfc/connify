'use client'

import NewsLetter from '@/components/newsLetter'
import TableWrapper from '@/components/tableWrapper'
import React, { useContext, useState } from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'
import { FaPlus, FaStar, FaTimes } from 'react-icons/fa'
import { Context } from '@/context/context'
import Loader from '@/components/loader'
import Image from 'next/image'
import AddFavorite from '@/components/addFavorite'

function Favorites() {
    const {favorites} = useContext(Context)
    const [showModal, setShowModal] = useState(false)
    const {data, isLoading} = useSWR(
        `v2/cryptocurrency/quotes/latest?id=${favorites.join()}`,
        fetcher
    )
    
    if(!favorites.length){
        return (
            <>
                {showModal && <AddFavorite setShowModal={setShowModal} />}
                <div className='px-4 sm:px-8 py-12 flex flex-col items-center gap-4'>
                    <p className='text-[10rem]'>
                        <Image
                            src="/empty.avif"
                            height={250}
                            width={250}
                            alt='Empty favorites'
                        />
                    </p>
                    <p>Your watchlist is empty</p>
                    <button onClick={()=>setShowModal(true)} className="bg-green-500 py-2 px-4 rounded-md text-white font-medium">Add Watchlist</button>
                </div>
            </>
        )
    }

    if(isLoading){
        return <Loader />
    }
    // console.log(error)


    const wishlist = Object.values(data?.data?.data);
    
    return (
        <>
            {showModal && <AddFavorite setShowModal={setShowModal} />}
            <main className=''>
                <article className='py-8 px-4 sm:px-8'>
                    <h2 className='text-3xl font-bold'>Crypto Watchlists</h2>
                    <div className='py-4 flex justify-end'>
                        <button onClick={()=>setShowModal(true)} className='flex items-center gap-2 bg-faded-grey rounded-md font-semibold px-2 py-1 text-sm'><FaPlus/> Add Coins</button>
                    </div>
                </article>
                <TableWrapper isLoading={isLoading} data={wishlist.sort((a, b) => a.cmc_rank - b.cmc_rank)} />
                <NewsLetter />
            </main>
        </>
    )
}

export default Favorites