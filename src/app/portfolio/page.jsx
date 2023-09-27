'use client'

import Image from 'next/image'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Context } from '../../context/context'
import Loader from '@/components/loader'
import { FaEllipsisV, FaEye, FaPlus } from 'react-icons/fa'
import LandingPage from '@/components/portfolio/landingPage'
import Modal from '@/components/portfolio/modal'
import { supabase } from '@/lib/supabaseClient'
import useSWR from 'swr'
import { PortfolioContext } from '../../context/portfolioContext'
import Assets from '@/components/portfolio/assets'
import { fetcher } from '../../../utils/utils'
import { useRouter } from 'next/navigation'

function PortFolio() {
    const { authLoading, user} = useContext(Context);
    const {data: data, isLoading, mutate} = useSWR(user?.id, fetchPortfolio)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const {setPortfolio, portfolio: {assets}} = useContext(PortfolioContext);
    const router = useRouter()
    const assetsId = useMemo(()=>{
        return assets.map(item => item.coin_name.id)
    },[assets])
    const {data: coinPrices, isLoading: coinPricesLoading, error} = useSWR(
        `v2/cryptocurrency/quotes/latest?id=${assetsId.join()}`,
        fetcher
    )

    useCallback(()=>{
        mutate();
    },[user, assets])
    
    if(authLoading || isLoading || coinPricesLoading){
        return <Loader />
    }
    console.log(data);
    if((!data || !coinPrices) && user?.id){
        return (
            <div className='px-8 py-40 text-center flex flex-col items-center justify-center'>
                <p>An error occured</p>
                <button onClick={()=>router.refresh()} className='px-3 py-2 rounded-md bg-faded-grey mt-8 ml-4 flex w-fit items-center gap-3'>Refresh</button>
            </div>
        )
    }

    async function fetchPortfolio(id){
        const {data:portfolio, error} = await supabase.from('portfolio').select().eq('user_id', id)
        console.log(portfolio)
        if(error){
            console.log(error)
            return;
        }

        const {data:assets, error: assetsError} = await supabase.from('assets').select(`*, transactions(*)`).eq('portfolio', portfolio[0].id)
        if(assetsError){
            console.log(assetsError)
            return;
        }
        setPortfolio({portfolio, assets})
        return {portfolio, assets};

    }
    console.log(data?.portfolio);
    const currentPortfolio = data?.portfolio?.find(portfolio => portfolio.is_default === true);

    return (
        <main>
            {showCreateModal && <Modal hideModal={setShowCreateModal} mutate={mutate} />}
            {user ? (
                <section className='px-4 sm:px-8 py-8'>
                    <div className='flex justify-between items-center'>
                        <span className='text-xl sm:text-2xl font-bold'>{currentPortfolio?.name}</span>

                        <div className='flex items-center gap-2 sm:gap-3'>
                            <button className='h-6 w-6 sm:h-10 sm:w-10 rounded-full grid place-content-center  sm:text-2xl hover:bg-green-500/30'>
                                <FaEye />
                            </button>
                            <button className='h-6 w-6 sm:h-10 sm:w-10 rounded-full grid place-content-center  sm:text-2xl hover:bg-green-500/30'>
                                <FaEllipsisV />
                            </button>
                            <button onClick={()=>setShowCreateModal(true)} className="bg-green-500 p-3 hidden sm:flex items-center text-white rounded-md">
                                <FaPlus /> Add Transaction
                            </button>
                        </div>
                    </div>
                    {data?.assets?.length ? (
                        <Assets assets={assets} prices={coinPrices} showAddModal={setShowCreateModal} />
                    ):
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

export default PortFolio