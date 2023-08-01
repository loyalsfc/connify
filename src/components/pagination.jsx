"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';


function Pagination({c, m}) {
    const router = useRouter();
    const limit = m
    function paginate() {
        let current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
    
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
    
        return rangeWithDots;
    }
    
    return (
        <div className='flex items-center sm:border border-faded-grey rounded'>
            <button 
                disabled={c == 0 ? true : false}
                className='hover:bg-green-400 h-full block hover:text-white px-2.5 py-1 border-r border-faded-grey disabled:cursor-not-allowed pointer-events-auto'
                onClick={() => router.push(`/?page=${c - 1}`)}
            >
                <FaAngleLeft />
            </button>
            {paginate().map((item, index) => {
                if(index === 0){
                    return(
                        <Link 
                            className='paginate-btn' 
                            key={index} 
                            href="/"
                        >
                            {item}
                        </Link>
                    )
                }else if (item === "..."){
                    return (
                        <button 
                            className='paginate-btn' 
                            key={index}
                            disabled={true}
                        >
                            {item}
                        </button>
                    )
                } else {
                    return <Link 
                            key={index}
                            href={`/?page=${item}`}
                            className={`${c == item  ? "bg-faded-grey" : ""} paginate-btn`}
                        >
                            {item}
                        </Link>
                }
            })
            }
            <button 
                disabled={c == (limit - 1) ? true : false}
                className='hover:bg-green-400 hover:text-white px-2.5 py-1 h-full block disabled:cursor-not-allowed leading-loose'
                onClick={() => router.push(`/?page=${c + 1}`)}
            >
                <FaAngleRight />    
            </button>
        </div>
    )
}

export default Pagination
