'use client'
import React, { useEffect, useRef, useState } from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'
import { FaAngleDown } from 'react-icons/fa'

function Converter() {
    const fromElement = useRef();
    const fromDisplay = useRef();
    const fromCurrencyElement = useRef();
    const [showToList, setShowToList] = useState(false)
    const [fromCurrency, setFromCurrency] = useState('Bitcoin (BTC)')
    const [quantity, setQuantity] = useState(1)
    const [fiatsList, setFiatsList] = useState([])
    const [coinsList, setCoinsList] = useState([])

    const {data, error, isLoading} = useSWR(
        // `v2/tools/price-conversion?amount=100&id=1&convert=NGN`,
        `v1/fiat/map`,
        fetcher
    )

    const {data: coins, error: coinsError, isLoading: coinsLoading} = useSWR(
        'v1/cryptocurrency/map?sort=cmc_rank',
        fetcher
    )

    useEffect(()=>{
        setFiatsList(data?.data?.data)
        setCoinsList(coins?.data?.data)
    },[data, coins])

    function handleClick(e, element){
        element.current.focus();
        setShowToList(true)
    }

    function handleChange(e){
        const value = e.target.value.toLowerCase();
        fromCurrencyElement.current.classList.add('hidden')
        fromDisplay.current.innerText = value; 
        e.target.style.width = fromDisplay.current.getBoundingClientRect().width + 'px'

        setCoinsList(coins?.data?.data.filter(item => item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value)))
        setFiatsList(data?.data?.data.filter(item => item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value) || item.sign.includes(value) ))
    }

    function handleBlur(e){
        fromCurrencyElement.current.classList.remove('hidden')
        e.target.value = "";
        fromDisplay.current.innerText = '';

        setFiatsList(data?.data?.data)
        setCoinsList(coins?.data?.data)
    }

    function changeCurrency(e, item){
        setFromCurrency(`${item.name} ${item.sign ?? ''} ${item.symbol}`);
        setShowToList(false);
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
                                    onChange={(e)=>setQuantity(e.target.value)}
                                />
                            </div>
                            <div className='flex-1'/>
                            <div className='w-[calc(50%_-_25px)]'/>
                        </div>
                        <div className="flex items-center justify-center mb-5">
                            <div className='w-[calc(50%_-_25px)]'>
                                <div className="relative">
                                    <div onClick={(e)=>handleClick(e, fromElement)} className='flex items-center py-0.5 relative overflow-hidden w-full border border-faded-grey bg-white rounded-lg text-black h-10 text-sm'>
                                        <div className='flex-1 overflow-hidden'>
                                            <div className='w-full flex items-center py-0.5 px-2 flex-wrap overflow-hidden'>
                                                <p ref={fromCurrencyElement} className='mx-0.5 max-w-[calc(100%_-_8px)] overflow-hidden absolute whitespace-nowrap text-ellipsis top-1/2 -translate-y-1/2'>{fromCurrency}</p>
                                                <div className='m-0.5 py-0.5 visible '>
                                                    <input
                                                        className='w-0.5 border-none focus:outline-none outline-none'
                                                        type="text" 
                                                        autoCapitalize='none' 
                                                        autoComplete='off' 
                                                        autoCorrect='off' 
                                                        ref={fromElement}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                    />
                                                    <span ref={fromDisplay} className='absolute top-0 left-0 invisible h-0 px-px overflow-scroll whitespace-pre w-fit'></span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex shrink-0 text-gray-300 items-center border-l border-faded-grey justify-center p-2'>
                                            <FaAngleDown />
                                        </div>
                                    </div>
                                    {showToList &&
                                        <div className="w-full top-12 bg-white shadow-md absolute pointer-events-none max-h-[300px] overflow-scroll">
                                            {fiatsList?.length || coinsList?.length ? (
                                                <div className='w-full py-4'>
                                                    {fiatsList?.length > 0 && <div>
                                                        <h3 className='text-medium-grey px-4 mb-1 font-semibold'>Fiat Currencies</h3>
                                                        <ul className='mb-4'>
                                                            {fiatsList?.map((item, index) =>{
                                                                if(index < 10){
                                                                    return <li 
                                                                        key={item.id}
                                                                        className='py-1 pointer-events-auto px-4 hover:bg-faded-grey cursor-pointer'
                                                                        onClick={(e)=>changeCurrency(e, item)}
                                                                    >
                                                                        {item.name} {item.sign} {item.symbol}</li>
                                                                }
                                                            })}
                                                        </ul>
                                                    </div>}
                                                    {coinsList?.length > 0 && <div>
                                                        <h3 className='text-medium-grey px-4 mb-1 font-semibold'>Cryptocurrencies</h3>
                                                        <ul>
                                                            {coinsList?.map((item, index) => {
                                                                if(index < 10){
                                                                    return <li
                                                                        key={item.id}
                                                                        className='py-1 pointer-events-auto px-4 hover:bg-faded-grey cursor-pointer'
                                                                        onClick={(e)=>changeCurrency(e, item)}
                                                                    >
                                                                        {item.name} {item.symbol}
                                                                    </li>
                                                                }
                                                            })}
                                                        </ul>
                                                    </div>}
                                                </div>
                                            ):(
                                                <p className='font-bold text-medium-grey p-4 text-center pointer-events-none'>No options</p>
                                            )}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className='flex-1 '>
                                <button className="bg-green-500 py-1.5 px-2.5 rounded-md text-white block w-fit mx-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="#FFF" height="16px" width="16px" viewBox="0 0 24 24" className="sc-aef7b723-0 fINSSs">
                                        <path d="M6 16H20M20 16L17 19M20 16L17 13" stroke="#FFF" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M18 8H4M4 8L7 11M4 8L7 5" stroke="#FFF" strokeWidth="2" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className='w-[calc(50%_-_25px)]'>
                                <div className="flex-1 flex items-center box-content">
                                    <select type="number" className='w-full border border-faded-grey bg-white rounded-lg text-black focus:outline-none px-4 h-10 text-sm'>
                                        <option value="USD">United States Dollar "$" (USD)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='flex'>
                            <div className='w-[calc(50%_-_25px)] text-end'>
                                <span value="BTC">1 Bitcoin (BTC)</span>
                            </div>
                            <div className='flex-1 text-center'>
                                =
                            </div>
                            <div className='w-[calc(50%_-_25px)]'>
                                <span >28,859 United States Dollar "$" (USD)</span>
                            </div>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    )
}

export default Converter
