'use client'
import React, { useMemo, useState } from 'react'

function TradeCalculator() {
    const [totalCapital, setTotalCapital] = useState(1000)
    const [riskPercent, setRiskPercent] = useState(5)
    const [tradeType, setTradeType] = useState('long')
    const [leverage, setLeverage] = useState(10)
    // const [positionSize, setPositionSize] = useState(1)
    const [entryPrice, setEntryPrice] = useState()
    const [exitPrice, setExitPrice] = useState()
    const [stopLoss, setStopLoss] = useState()

    const riskCapital = useMemo(()=>{ 
        let calcAmount = totalCapital * (riskPercent / 100);

        if(calcAmount === Infinity || calcAmount === 0){
            return '-'
        } else if(calcAmount.toFixed(1) == 0.0){
            return calcAmount.toFixed(4)
        }
        return calcAmount.toFixed(2)
    },[totalCapital, riskPercent])

    const calculateLiquidation = useMemo(()=>{
        if(tradeType === "short"){

        } else {

        }

    },[])

    const percentageChange = useMemo(()=>{
        if(tradeType === "long"){
            let changes = exitPrice - entryPrice
            return ((changes / entryPrice) * 100).toFixed(2)
        }
        let changes = entryPrice - exitPrice
        return ((changes / exitPrice) * 100).toFixed(2)
    },[entryPrice, exitPrice, tradeType])
    
    const margin = useMemo(()=>{
        const stopLossPercent = (stopLoss - entryPrice) / entryPrice * 100;
        const initialMargin = riskCapital / stopLossPercent * 100
        return (initialMargin * (leverage / 100)).toFixed(2)

    },[riskCapital, stopLoss, entryPrice, leverage])

    const roe = useMemo(()=>{
        return percentageChange * leverage
    },[percentageChange, leverage])

    const positionSize = useMemo(()=>{
        return margin / entryPrice
    },[margin, entryPrice])


    return (
        <main className='px-4 md:px-8 bg-[#F8F8F8] mb-8'>
            <section className='md:p-8 pt-4 grid sm:gap-8 grid-cols-1 sm:grid-cols-2 text-sm max-w-3xl mx-auto'>
                <div>
                    <article className='calc-wrapper'>
                        <ItemInput 
                            label="Total Capital" 
                            id="total-capital" 
                            value={totalCapital} 
                            onChange={setTotalCapital}
                        />
                        <ItemInput 
                            label="Risk" 
                            id="risk-capital" 
                            value={riskPercent} 
                            onChange={setRiskPercent}
                        />
                    </article>

                    <article className='calc-wrapper'>
                        <InputWrapper label="Type" id="type">
                            <div className="flex gap-1 p-0.5 border border-medium-grey rounded-md bg-white flex-1">
                                <div className='w-1/2 font-semibold'>
                                    <input 
                                        className='hidden' 
                                        type="radio" 
                                        id='long-type' 
                                        name='trade-type' 
                                        value="long"
                                        onChange={(e)=>setTradeType(e.target.value)}
                                        checked={tradeType == "long"}
                                        
                                    />
                                    <label htmlFor='long-type' className='long-type type-wrapper'>Long</label>
                                </div>
                                <div className='w-1/2'>
                                    <input 
                                        className='hidden' 
                                        type="radio" 
                                        id='short-type' 
                                        name='trade-type' 
                                        value="short"
                                        onChange={(e)=>setTradeType(e.target.value)}
                                        checked={tradeType == "short"}                                        
                                    />
                                    <label htmlFor='short-type' className='short-type type-wrapper'>Short</label>
                                </div>
                            </div>
                        </InputWrapper>
                        <InputWrapper label="Leverage" id="leverage">
                            <div className='flex-1 flex gap-2 items-center'>
                                <input 
                                    className='flex-1 slider bg-medium-grey' 
                                    type="range" 
                                    id='leverage' 
                                    min={1} 
                                    max={100} 
                                    value={leverage}
                                    onChange={(e)=>setLeverage(e.target.value)}
                                />
                                <input 
                                    type="number" 
                                    className='p-2 w-16 bg-white border border-medium-grey text-xs block rounded-[5px]'
                                    value={leverage}
                                    onChange={(e)=>setLeverage(e.target.value)}
                                />
                            </div>
                        </InputWrapper>
                        <ItemInput 
                            label="Entry" 
                            id="entry-price" 
                            value={entryPrice}
                            onChange={setEntryPrice}
                        />
                        <ItemInput 
                            label="Stop" 
                            id="stop-price" 
                            value={stopLoss}
                            onChange={setStopLoss}
                        />
                        <ItemInput 
                            label="Exit" 
                            id="exit-price" 
                            value={exitPrice}
                            onChange={setExitPrice}
                        />
                    </article>
                </div>
                <div className='calc-wrapper text-sm'>
                    <p className='flex justify-between py-1.5'>Risked Capital <span>${riskCapital}</span></p>
                    <p className='flex justify-between py-1.5'>
                        Margin 
                        <span> 
                            {entryPrice && stopLoss ?
                                <span className={margin> 0 ? 'text-green-500' : 'text-red-500'}>${margin}</span> : "-"
                            }
                        </span>
                    </p>
                    <p className='flex justify-between py-1.5'>Position Size <span>{positionSize ?? "-"}</span></p>
                    <p className='flex justify-between py-1.5'>Liquidation <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Risk / Reward <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Estimated PnL <span>-</span></p>
                    <p className='flex justify-between py-1.5'>
                        ROE
                        <span> 
                            {entryPrice && exitPrice ?
                                <span>{roe}%</span> : "-"
                            }
                        </span>
                    </p>
                    <p className='flex justify-between py-1.5'>
                        Percent 
                        <span>
                            {entryPrice && exitPrice ? 
                            <span className={percentageChange > 0 ? 'text-green-500' : 'text-red-500'}>{percentageChange}%</span>: "-"}
                        </span>
                    </p>
                </div>
            </section>
        </main>
    )
}

function InputWrapper({label, id, children}){
    return (<div className='flex items-center gap-5'>
        <label htmlFor={id} className='font-semibold w-1/4'>{label}</label>
        {children}
    </div>)
}

function ItemInput({label, id, value, onChange}){
    return(
        <InputWrapper label={label} id={id}>
            <div className={`flex items-center border border-medium-grey flex-1 rounded-md overflow-hidden ${id === "risk-capital" ? "flex-row-reverse" : ""}`}>
                <span className='p-2 bg-faded-grey text-xs'>{id === "risk-capital" ? "%" : "$"}</span>
                <input 
                    type="number" 
                    id={id} 
                    className='p-2 text-xs flex-1 focus:outline-none bg-white border-none' 
                    value={value}
                    onChange={(e)=>onChange(e.target.value)}
                />
            </div>
        </InputWrapper>
    )
}

export default TradeCalculator