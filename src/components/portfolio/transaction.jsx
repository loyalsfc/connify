import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { FaDollarSign, FaPen, FaTimes } from 'react-icons/fa'
import { fetcher, formatPrice, getImage } from '../../../utils/utils'
import useSWR from 'swr'

function Transaction({coin, hideFunction, callbackFunc}) {
    const [activeTab, setActiveTab] = useState("buy")
    
    return (
        <div>
            <h2 className='text-2xl font-bold flex justify-between mt-4'>Add Transaction <button onClick={()=>hideFunction(false)} className='text-medium-grey/50'><FaTimes/></button></h2>
            <div className='grid grid-cols-3 border-b border-medium-grey/50 pb-0.5 mb-4'>
                <button 
                    onClick={()=>{setActiveTab('buy')}}
                    className={`transaction-btn ${activeTab === "buy" ? "transaction-active" : ""}`}>Buy</button>
                <button 
                    onClick={()=>{setActiveTab('sell')}}
                    className={`transaction-btn ${activeTab === "sell" ? "transaction-active" : ""}`}>Sell</button>
                <button 
                    onClick={()=>{setActiveTab('transfer')}}
                    className={`transaction-btn ${activeTab === "transfer" ? "transaction-active" : ""}`}>Transfer</button>
            </div>
            <div>
                {activeTab === "buy" && <BuySellComponent hideFunction={hideFunction} callbackFunc={callbackFunc} coin={coin} type="buy"/>}
                {activeTab === "sell" && <BuySellComponent hideFunction={hideFunction} callbackFunc={callbackFunc} coin={coin} type="sell"/>}
                {activeTab === "transfer" && <TransferComponent hideFunction={hideFunction} callbackFunc={callbackFunc} coin={coin} type="transfer"/>}
            </div>
        </div>
    )
}

function BuySellComponent({type, coin, callbackFunc, hideFunction}){
    const {data: coinData, error} = useSWR(
        `v2/cryptocurrency/quotes/latest?slug=${coin.slug}`,
        fetcher
    )
    
    const [pricePerCoin, setPricePerCoin] = useState('')
    const [coinQuantity, setCoinQuantity] = useState()
    const [date, setDate] =useState(new Date().toISOString().slice(0, 16))

    useEffect(()=>{
        const data = coinData?.data?.data?.[coin.id]
        setPricePerCoin(data?.quote.USD.price)
    },[coinData])

    const handleSubmit = (e) => {
        e.preventDefault();
        callbackFunc(coinQuantity, pricePerCoin, date, type);
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label htmlFor="price-per-coin" className='font-semibold text-sm mb-0.5'>Price Per Coin</label>
                <div className='flex transaction-input'>
                    <span className='p-3 flex items-center bg-faded-grey font-semibold gap-2'>
                        USD
                    </span>
                    <input 
                        type="number" 
                        id='price-per-coin'
                        value={pricePerCoin}
                        onChange={(e)=>setPricePerCoin(e.target.value)}
                        className='flex-1 border-none focus:outline-none p-3'
                    />
                </div>
            </div>
            <div className='mb-4'>
                <label htmlFor="coin-quantity" className='font-semibold text-sm mb-0.5'>Quantity</label>
                <div className='flex flex-row-reverse transaction-input'>
                    <span className='p-3 flex items-center bg-faded-grey font-semibold gap-2'>
                        <Image
                            src={getImage(coin.id)}
                            height={24}
                            width={24}
                            alt='Coin Logo'
                        />
                        {coin.symbol}
                    </span>
                    <input 
                        type="number" 
                        id='coin-quantity'
                        value={coinQuantity}
                        onChange={(e)=>setCoinQuantity(e.target.value)}
                        className='flex-1 border-none focus:outline-none p-3'
                    />
                </div>
            </div>
            <DateComp
                setDate={setDate}
                date={date}
            />
            <div className='bg-faded-grey rounded-md p-4 mb-4'>
                <span className='text-sm text-medium-grey'>Total {type === "buy" ? "Spent" : "Received"}</span>
                <p className="text-2xl font-bold">${pricePerCoin && coinQuantity ? formatPrice(pricePerCoin * coinQuantity) : 0}</p>
            </div>
            <div className='grid grid-cols-2 gap-4'>
                <button onClick={()=>hideFunction(false)} type='button' className='cancel-button'>Cancel</button>
                <button className='submit-button'>Submit</button>
            </div>
        </form>
    )
}

function TransferComponent({coin, callbackFunc, hideFunction}){
    const [transferType, setTransferType] = useState('in')
    const [coinQuantity, setCoinQuantity] = useState('')
    const [date, setDate] =useState(new Date().toISOString().slice(0, 16))

    const handleSubmit = (e) => {
        e.preventDefault();
        callbackFunc(coinQuantity, null, date, 'transfer', transferType);
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label htmlFor="transfer-type" className='font-semibold text-sm mb-0.5'>Transfer</label>
                <div className='transaction-input pe-2'>
                    <select
                        id='transfer-type'
                        value={transferType}
                        onChange={(e)=>setTransferType(e.target.value)}
                        className='w-full border-none focus:outline-none p-3'
                    >
                        <option value="in">Transfer in</option>
                        <option value="out">Transfer Out</option>
                    </select>
                </div>
            </div>
            <div className='mb-4'>
                <label htmlFor="coin-quantity" className='font-semibold text-sm mb-0.5'>Quantity</label>
                <div className='flex flex-row-reverse transaction-input'>
                    <span className='p-3 flex items-center bg-faded-grey font-semibold gap-2'>
                        <Image
                            src={getImage(coin.id)}
                            height={24}
                            width={24}
                            alt='Coin Logo'
                        />
                        {coin.symbol}
                    </span>
                    <input 
                        type="number" 
                        id='coin-quantity'
                        value={coinQuantity}
                        onChange={(e)=>setCoinQuantity(e.target.value)}
                        className='flex-1 border-none focus:outline-none p-3'
                    />
                </div>
            </div>
            <DateComp date={date} setDate={setDate} />
            <div className='grid grid-cols-2 gap-4'>
                <button onClick={()=>hideFunction(false)} type='button' className='cancel-button'>Cancel</button>
                <button className='submit-button'>Submit</button>
            </div>
        </form>
    )
}

function DateComp({date, setDate}){
    return(
        <div className='flex gap-4 items-center mb-4'>
            <p className='transaction-label'>
                <input 
                    type='datetime-local' 
                    name="transaction-date" 
                    id="transaction-date" 
                    onChange={(e)=>setDate(e.target.value)}
                    value={date}
                    className='bg-transparent'
                />
            </p>
            <p className='transaction-label'><FaDollarSign/> Fee </p>
            <p className='transaction-label'><FaPen/> Notes </p>
        </div>
    )
}

export default Transaction