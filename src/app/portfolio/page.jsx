'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Context } from '../../context/context'
import Loader from '@/components/loader'
import { FaEllipsisV, FaEye, FaPlus } from 'react-icons/fa'
import LandingPage from '@/components/portfolio/landingPage'
import Modal from '@/components/portfolio/modal'
import { supabase } from '@/lib/supabaseClient'
import useSWR from 'swr'
import { PortfolioContext } from '../../context/portfolioContext'

function PortFolio() {
    const {setShowAuthModal, authLoading, user} = useContext(Context);
    const {data: data, isLoading, error, mutate} = useSWR(user?.id, fetchPortfolio)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const {setPortfolio} = useContext(PortfolioContext)
    
    useCallback(()=>{
        mutate();
    },[user])
    
    if(authLoading || isLoading){
        return <Loader />
    }
    async function fetchPortfolio(id){
        const {data:portfolio, error} = await supabase.from('portfolio').select().eq('user_id', id)
        
        if(error){
            console.log(error)
            return;
        }

        const {data:assets, error: assetsError} = await supabase.from('assets').select().eq('portfolio', portfolio[0].id)
        if(assetsError){
            console.log(assetsError)
            return;
        }
        setPortfolio({portfolio, assets})
        return {portfolio, assets};

    }

    const portfolio = data?.portfolio.find(portfolio => portfolio.is_default === true);
    

    return (
        <main>
            {showCreateModal && <Modal hideModal={setShowCreateModal} />}
            {user ? (
                <section className='px-4 sm:px-8 py-8'>
                    <div className='flex justify-between items-center'>
                        <span className='text-2xl font-bold'>{portfolio?.name}</span>

                        <div className='flex items-center gap-3'>
                            <button className='h-10 w-10 rounded-full grid place-content-center text-2xl hover:bg-green-500/30'>
                                <FaEye />
                            </button>
                            <button className='h-10 w-10 rounded-full grid place-content-center text-2xl hover:bg-green-500/30'>
                                <FaEllipsisV />
                            </button>
                            <button className="bg-green-500 p-3 flex items-center text-white rounded-md">
                                <FaPlus /> Add Transaction
                            </button>
                        </div>
                    </div>
                    <div className='flex gap-6'>
                        <BalanceCard amount={'0.00'} note="Total Balance" />
                        <BalanceCard amount={'0.00'} note="Total Profit / Loss (-)" />
                    </div>
                    {data?.assets?.length ? <p>Hello World</p> :
                        <div className='text-center flex flex-col items-center py-8'>
                        <Image
                            src="/empty.svg"
                            height={200}
                            width={200}
                            alt='Empty'
                        />
                        <h4 className='text-xl font-semibold mt-4'>This portfolio requires a few finishing touches...</h4>
                        <button onClick={()=>setShowCreateModal(true)} className='text-green-500'>Add a new coin to get started!</button>
                    </div>
                }
                </section>
            ):(
                <LandingPage />
            )}
        </main>
    )
}

function BalanceCard({amount, note}){
    return(
        <div className='rounded-lg shadow-md bg-white p-4 mb-4 mr-2 w-fit'>
            <h5 className='text-xl font-medium'>${amount}</h5>
            <p className='text-sm'>{note}</p>
        </div>
    )
}

export default PortFolio