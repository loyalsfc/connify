'use client'
import React, { useRef, useState } from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'
import { FaAngleDown } from 'react-icons/fa'

function Converter() {
    const fromElement = useRef();
    const [fromDisplay, setFromDisplay] = useState('Bitcoin (BTC)')
    // const {data, error, isLoading} = useSWR(
    //     // `v2/tools/price-conversion?amount=100&id=1&convert=NGN`,
    //     `v1/fiat/map`,
    //     fetcher
    // )

    // console.log(data?.data?.data)

    // const fiats = data?.data?.data?.map(item => {
    //     const {symbol} = item;
    //     return <option value={symbol}></option>
    // })

    function handleClick(e, element){
        element.current.focus();
    }

    function handleChange(e){
        setFromDisplay('')
        e.target.style.width = getTextWidth(e.value) + 'px';

    }

    function getTextWidth(text) {
        const dummyElement = document.createElement('span');
        dummyElement.style.visibility = 'hidden';
        dummyElement.style.whiteSpace = 'pre';
        dummyElement.textContent = text;
        // inputContainer.appendChild(dummyElement);
        const width = dummyElement.getBoundingClientRect().width;
        // inputContainer.removeChild(dummyElement);
        return width;
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
                                    value={1}
                                />
                            </div>
                            <div className='flex-1'/>
                            <div className='w-[calc(50%_-_25px)]'/>
                        </div>
                        <div className="flex items-center justify-center mb-5">
                            <div className='w-[calc(50%_-_25px)]' onClick={(e)=>handleClick(e, fromElement)}>
                                <div className='flex items-center py-0.5 relative overflow-hidden w-full border border-faded-grey bg-white rounded-lg text-black focus:outline-none h-10 text-sm'>
                                    <div className='flex-1 flex items-center box-content'>
                                        <div className='p-0.5'>
                                            <input
                                                className='w-0.5 block overflow-visible border-none focus:outline-none'
                                                type="text" 
                                                autoCapitalize='none' 
                                                autoComplete='off' 
                                                autoCorrect='off' 
                                                ref={fromElement}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <span>{fromDisplay}</span>
                                    </div>
                                    <div className='flex shrink-0 text-gray-300 items-center border-l border-faded-grey justify-center p-2'>
                                        <FaAngleDown />
                                    </div>
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
                                <select type="number" className='w-full border border-faded-grey bg-white rounded-lg text-black focus:outline-none px-4 h-10 text-sm'>
                                    <option value="USD">United States Dollar "$" (USD)</option>
                                </select>
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
