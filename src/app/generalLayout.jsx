'use client'

import React, { useContext, useEffect, useRef } from 'react'
import { Context } from '../context/context'
import { FaAngleUp } from 'react-icons/fa'

function GeneralLayout({children}) {
    const {notificationRef} = useContext(Context)
    const scrollBtn = useRef()
    const scrollTop = () => {
        window.scrollTo(0,0)
    }
    useEffect(()=>{
        window.onscroll = function() {scrollFunction()};

        function scrollFunction() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                scrollBtn.current.classList.replace('opacity-0', 'opacity-100')
            } else {
                scrollBtn.current.classList.replace('opacity-100', 'opacity-0')
            }
        }
    },[])

    return (
        <section className='relative'>
            <div className="fixed top-0 right-0 w-full p-4 pointer-events-none z-[9999]" ref={notificationRef}>
            </div>
            <button 
                onClick={scrollTop} 
                ref={scrollBtn} 
                className='h-10 w-10 bg-green-500/75 z-[9999] opacity-0 hover:bg-green-500 text-white text-xl grid place-content-center fixed right-4 md:right-16 bottom-20 rounded-md transition-all'
            >
                <FaAngleUp />
            </button>
            {children}
        </section>
    )
}

export default GeneralLayout