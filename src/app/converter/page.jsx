'use client'
import React, { useCallback, useState } from 'react'
import { fetcher, toTwoDecimalPlace } from '../../../utils/utils'
import useSWR from 'swr'
import Dropdown from '@/components/converter/dropdown'

function Converter() {
    const [fromCurrency, setFromCurrency] = useState({ fullName: 'Bitcoin (BTC)', symbol: 'BTC', id: 1})
    const [toCurrency, setToCurrency] = useState({ fullName: 'United States Dollar "$" (USD)', symbol: 'USD', id: 2781})
    const [quantity, setQuantity] = useState(1)

    const {data, isLoading, mutate} = useSWR(
        `v2/tools/price-conversion?amount=${quantity}&id=${fromCurrency.id}&convert=${toCurrency.symbol}`,
        fetcher
    )

    useCallback(()=>{
        mutate()
    },[fromCurrency, toCurrency])
    
    function swapCurrency(){
        setFromCurrency(toCurrency);
        setToCurrency(fromCurrency);
    }
    
    const handleChange = (e) => {
        const value = e.target.value
        setQuantity(value == "" ? 1 : value)
    }

    return (
        <main className="pt-8">
            <section className="px-4 sm:px-8">
                <article>
                    <h1 className='my-6 text-2xl text-center font-semibold'>Cryptocurrency Converter Calculator</h1>
                    <div className='bg-[#F8F8F8] p-6 my-5 mx-auto rounded-md sm:max-w-[66%]'>
                        <div className='flex items-center mb-5 justify-center'>
                            <div className='w-[calc(50%_-_25px)]'>
                                <input 
                                    type="number" 
                                    className='w-full border border-faded-grey bg-white rounded-lg text-black focus:outline-none px-4 h-10 text-sm' placeholder='Enter Amount to Convert'
                                    value={quantity}
                                    onChange={handleChange}
                                    min={1}
                                />
                            </div>
                            <div className='flex-1'/>
                            <div className='w-[calc(50%_-_25px)]'/>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-0 items-center justify-center mb-5">
                            <Dropdown 
                                itemCurrency={fromCurrency}
                                setItemCurrency={setFromCurrency}
                            />
                            <div className='flex-1 '>
                                <button onClick={swapCurrency} className="bg-green-500 py-1.5 px-2.5 rounded-md text-white block w-fit mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="16px" width="16px" viewBox="0 0 24 24" className="sc-aef7b723-0 fINSSs">
                                        <path d="M6 16H20M20 16L17 19M20 16L17 13" stroke="#FFF" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M18 8H4M4 8L7 11M4 8L7 5" stroke="#FFF" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                            </div>
                            <Dropdown 
                                itemCurrency={toCurrency}
                                setItemCurrency={setToCurrency}
                            />
                        </div>
                        <div className='flex mb-5'>
                            <div className='w-[calc(50%_-_25px)] text-end'>
                                <span value="BTC">{quantity} {fromCurrency.fullName}</span>
                            </div>
                            <div className='flex-1 text-center'>
                                =
                            </div>
                            <div className='w-[calc(50%_-_25px)]'>
                                <div className='flex gap-1 items-center'>{isLoading ? 
                                    <div className='h-4 w-4 border-2 border-medium-grey rounded-full border-t-[#F8F8F8] animate-spin shrink-0'></div>:
                                    <div className='whitespace-pre-wrap'>{toTwoDecimalPlace(data?.data?.data?.quote[toCurrency.symbol]?.price)}</div>} {toCurrency.fullName}
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-center' onClick={()=>mutate()}>
                            <button className='py-1.5 px-3.5 rounded-md border-faded-grey border bg-white text-sm'>Refresh</button>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default Converter
