'use client'

import { supabase } from '@/lib/supabaseClient'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { FaAngleLeft } from 'react-icons/fa'
import useSWR from 'swr'
import { fetcher } from '../../../../utils/utils'

function Transactions() {
    const {id} = useParams()
    const {data: transaction, isLoading: transactionLoading} = useSWR('transactions', fetchTransaction)
    // const {data, isLoading, error} = useSWR(
    //     `v2/cryptocurrency/quotes/latest?id=1`  ,
    //     fetcher
    // )
    if(transactionLoading){
        return <p>I dey load</p>
    }

    console.log(transaction)
    async function fetchTransaction(){
        const {data, error} = await supabase.from('transactions')
            .select(`*, assets(*)`)
            .eq('id', id)
            .limit(1)
            .single()
        console.log(data, error)
        return data;
    }   
    return (
        <main>
            <section className='px-4 sm:px-8 py-8'>
                <button><FaAngleLeft/> Back</button>
                <article>
                    <h1>
                        <span>Bitcoin (BTC) Balance</span>
                    </h1>
                </article>
            </section>
        </main>
    )
}

export default Transactions