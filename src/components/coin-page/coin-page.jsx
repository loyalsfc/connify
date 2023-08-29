'use client'

import React, { useRef } from 'react'
import { toTwoDecimalPlace } from '../../../utils/utils'

function CoinToUsd({price, symbol}) {
    const qtyField = useRef()
    const priceField = useRef()
    const handleQty = (e) => {
        priceField.current.value = (e.target.value * price).toFixed(2)
    }

    const handlePrice = (e) => {
        qtyField.current.value =(e.target.value / price).toFixed(5)
    }

    return (
        <article className='bg-faded-grey pb-4 rounded-md w-fit mx-auto'>
            <div className='flex flex-col sm:flex-row gap-4 px-4 py-4'>
                <div className='bg-white rounded-md'>
                    <span className='px-2 border-r border-white'>{symbol}</span>
                    <input 
                        type="number" 
                        className='py-2  px-2 border-l-2 border-faded-grey focus:outline-none' 
                        onChange={(e)=>handleQty(e)}
                        ref={qtyField}
                    />
                </div>
                <div className='bg-white rounded-md'>
                    <span className='px-2 border-r border-white'>USD</span>
                    <input 
                        type="number" 
                        className='py-2 px-2 border-l-2 border-faded-grey focus:outline-none' 
                        onChange={(e)=>handlePrice(e)}
                        ref={priceField}
                    />
                </div>
            </div>
            <p className='text-center font-semibold text-sm'>1 {symbol} = ${toTwoDecimalPlace(price)}</p>
        </article>
    )
}

export default CoinToUsd