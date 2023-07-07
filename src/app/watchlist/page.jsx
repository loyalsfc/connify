'use client'

import NewsLetter from '@/components/newsLetter'
import TableWrapper from '@/components/tableWrapper'
import React, { useContext, useState } from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'
import { FaPlus, FaTimes } from 'react-icons/fa'
import { Context } from '@/context/context'
import Loader from '@/components/loader'
import ModalWrapper from '@/components/modalWrapper'
import CoinList from '@/components/portfolio/coinList'

function Favorites() {
    const {favorites} = useContext(Context)
    const [showModal, setShowModal] = useState(false)
    const {data, error, isLoading} = useSWR(
        `v2/cryptocurrency/quotes/latest?id=${favorites.join()}`,
        fetcher
    )
    
    if(isLoading){
        return <Loader />
    }

    const wishlist = Object.values(data?.data?.data);

    return (
        <>
            {showModal && <ModalWrapper>
                <div className='h-full flex flex-col gap-4 sm:h-[534px]'>
                    <div className='flex-1 overflow-scroll'>
                        <CoinList />
                    </div>
                    <div className='flex items-center gap-3 overflow-scroll flex-nowrap'>
                        {favorites.map(item => {
                            return <div className='py-1 px-2 rounded-sm bg-faded-grey text-sm flex items-center gap-1'>
                                        {wishlist.find(item => item.id === item).name}
                                        <button><FaTimes /></button>
                                    </div>
                        })}
                    </div>
                    <button className='bg-green-500 w-full py-2 rounded-md font-medium text-white '>Add {favorites.length} coin</button>
                </div>
            </ModalWrapper>}
            <main className='py-8 px-4 sm:px-8'>
                <h2 className='text-3xl font-bold'>Crypto Watchlists</h2>
                <div className='py-4 flex justify-end'>
                    <button onClick={()=>setShowModal(true)} className='flex items-center gap-2 bg-faded-grey rounded-md font-semibold px-2 py-1 text-sm'><FaPlus/> Add Coins</button>
                </div>
                <TableWrapper isLoading={isLoading} data={wishlist} pageIndex={0} limit={100} />
                <NewsLetter />
            </main>
        </>
    )
}

export default Favorites