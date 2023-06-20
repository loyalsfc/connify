'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { Context } from '../../../context'
import Loader from '@/components/loader'
import { FaPlus } from 'react-icons/fa'

function PortFolio() {
    const {setShowAuthModal, authLoading, user} = useContext(Context);
    if(authLoading){
        return <Loader />
    }
    return (
        <main>
            {user ? (
                <section className='px-4 sm:px-8 py-8'>
                    <div>
                        <span>My Portfolio</span>

                        <div>
                            <button className="bg-green-500 p-3">
                                <FaPlus /> Add Transaction
                            </button>
                        </div>
                    </div>
                </section>
            ):(
                <section className='px-4 sm:px-8'>
                    <div className='flex flex-col-reverse md:flex-row items-center gap-8 '>
                        <article className='w-full md:w-1/2 mb-10 md:mb-0'>
                            <h2 className='text-green-500 font-semibold text-2xl'>Free and Powerful</h2>
                            <h1 className='text-3xl font-bold my-4'>Crypto Portfolio Manager</h1>
                            <p className='font-semibold text-lg mb-10 sm:max-w-md'>Effortlessly monitor your gains, losses, and portfolio value using our intuitive platform</p>
                            <div className='text-lg flex gap-4 text-center'>
                                <button onClick={()=>setShowAuthModal({isShown: true, type: 'sign-up'})} className='border rounded-md border-green-500 p-3 w-32 text-white bg-green-500/80 hover:bg-green-500' href="">Sign Up</button>
                                <button onClick={()=>setShowAuthModal({isShown: true, type: 'login'})} className='border rounded-md border-medium-grey p-3 w-32 hover:border-green-500' href="">Log in</button>
                            </div>
                        </article>
                        <div className='w-full md:w-1/2 py-20'>
                            <div className='relative w-full h-full'>
                                <Image
                                    src="/manager.svg"
                                    height={400}
                                    width={400}
                                    alt='manager'
                                />
                            </div>
                        </div>
                    </div>

                    <article className='grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto'>
                        <Cards 
                            icon="📈" 
                            title="Real-time Price Data" 
                            text="Real-time updates around the clock, utilizing price data from top-tier exchanges."
                        />
                        <Cards 
                            icon="📲" 
                            title="Synced across Web & Mobile App" 
                            text="Seamless portfolio tracking right at your fingertips, accessible anytime and anywhere."
                        />
                        <Cards 
                            icon="💲" 
                            title="Free to use" 
                            text="Premium-grade crypto portfolio tracking, completely free of charge."
                        />
                        <Cards 
                            icon="🛡️" 
                            title="Your data is protected " 
                            text="Ensuring utmost data security and privacy is our top priority."
                        />
                    </article>
                </section>
            )}
        </main>
    )
}

function Cards({icon, title, text}){
    return(
        <div className='bg-faded-grey rounded-xl p-8'>
            <p className='text-4xl mb-4'>{icon}</p>
            <h4 className='text-2xl font-semibold'> {title}</h4>
            <p>{text}</p>
        </div>
    )
}

export default PortFolio