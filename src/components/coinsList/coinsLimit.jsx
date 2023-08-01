
'use client'

import React from 'react'
import Pagination from '../pagination'
import { useRouter } from 'next/navigation';

function CoinsLimit({pageIndex, metrics, limit}) {
    const router = useRouter()
    const lastNumber = Math.ceil(metrics?.data?.active_cryptocurrencies / limit) ;

    const handleChange = async(e) => {
        const value = e.target.value;
        await fetch("/api/cookies",{
            method: "POST",
            body: JSON.stringify({value})
        })
        router.refresh();
    }

    return (
        <>
            <div className='sm:hidden bg-news-grey py-5 grid place-content-center'>
                <Pagination c={pageIndex} m={lastNumber}/>
            </div>

            <div className='flex justify-between items-center mt-4 mb-10 px-4 sm:px-8'>
                <p className='text-sm sm:text-base'>Showing {((pageIndex - 1) * limit) + 1} - {(pageIndex) * limit } </p>
                <div className='hidden sm:block'>
                    <Pagination c={pageIndex} m={lastNumber}/>
                </div>
                <div className='text-sm flex items-center gap-1'>
                    <label htmlFor="selectrow" className='text-medium-grey text-sm sm:text-base'>Show rows</label>
                    <select 
                        className='focus:outline-none bg-faded-grey py-1.5 px-2 rounded text-black' 
                        name="limit" 
                        id="limit"
                        defaultValue={limit}
                        onChange={handleChange}
                    >
                        <option value="100">100</option>
                        <option value="50">50</option>
                        <option value="20">20</option>
                    </select>
                </div>
            </div>
        </>
    )
}

export default CoinsLimit