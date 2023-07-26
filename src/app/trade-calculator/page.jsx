'use client'

import React, { useMemo, useState } from 'react'

export const metadata = {
    title: 'Trade Calculator',
    openGraph: {
        title: 'Trade Calculator',
    },
}

function TradeCalculator() {
    const [totalCapital, setTotalCapital] = useState(1000)
    const [riskPercent, setRiskPercent] = useState(5)
    const [tradeType, setTradeType] = useState('long')
    const [leverage, setLeverage] = useState(10)
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

    const positionSize = useMemo(()=>{
        const loss = Math.abs(entryPrice - stopLoss);
        const lossPercentage = (loss / entryPrice ) * 100
        const size = (riskCapital / lossPercentage) * 100
        return (size / entryPrice).toFixed(3)
    },[riskCapital, stopLoss, entryPrice])

    const margin = useMemo(()=>{
        const initialMargin = positionSize * entryPrice;
            return (initialMargin / leverage).toFixed(2)
    },[positionSize, entryPrice, leverage])

    const pnl = useMemo(()=>{
        let profit = tradeType === "long" ? (exitPrice - entryPrice) : (entryPrice - exitPrice);
        return (profit * positionSize).toFixed(2)
    },[exitPrice, entryPrice, positionSize])

    const roe = useMemo(()=>{
        return ((pnl / margin) * 100).toFixed(2)
    },[pnl, margin])

    const percentageChange = useMemo(()=>{
        const change = exitPrice - entryPrice;
        if(tradeType === "long"){
            const percent = (change / entryPrice) * 100;
            return percent.toFixed(2)
        }
        const percent = (change / exitPrice) * 100;
        return percent.toFixed(2)
    }, [entryPrice, exitPrice])

    const liquidity = useMemo(()=>{
        
    },[])

    const riskReward = useMemo(()=>{
        const potentialProfit = exitPrice - entryPrice;
        const potentialLoss = entryPrice - stopLoss;
        const rrr = potentialProfit / potentialLoss
        return rrr.toFixed(2);
    },[exitPrice, entryPrice, stopLoss])

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
                <div className='calc-wrapper relative text-sm'>
                    {tradeType === "long" && parseFloat(entryPrice) < parseFloat(stopLoss) && <Warning text='below' />}
                    {tradeType === "short" && parseFloat(entryPrice) > parseFloat(stopLoss) && <Warning text='above' />}
                    <p className='flex justify-between py-1.5'>Risked Capital <span className=''>${riskCapital}</span></p>
                    <p className='flex justify-between py-1.5'>
                        Margin 
                        <span> 
                            { entryPrice && stopLoss ?
                                <span className={margin < totalCapital ? 'text-green-500' : 'text-red-500'}>${margin}</span> : "-"
                            }
                        </span>
                    </p>
                    <p className='flex justify-between py-1.5'>Position Size <span className='font-semibold'>{isNaN(positionSize) ? "-" : positionSize}</span></p>
                    <p className='flex justify-between py-1.5'>Liquidation <span>-</span></p>
                    <p className='flex justify-between py-1.5'>
                        Risk / Reward 
                        {isNaN(riskReward) ? <span>-</span> : <span className={riskReward >= 1 ? "text-green-500" : "text-red-500"}>{riskReward}</span>}
                    </p>
                    <p className='flex justify-between py-1.5'>
                        Estimated PnL 
                        {isNaN(pnl) ? <span>-</span> : <span className={pnl > 0 ? "text-green-500" : "text-red-500"}>${pnl}</span>}
                    </p>
                    <p className='flex justify-between py-1.5'>
                        ROE
                        {isNaN(roe) ? <span>-</span> : <span className={roe > 0 ? "text-green-500" : "text-red-500"}>{roe}%</span>}
                        
                    </p>
                    <p className='flex justify-between py-1.5'>
                        Percent 
                        {isNaN(percentageChange) ? <span>-</span> : <span className={percentageChange > 0 ? "text-green-500" : "text-red-500"}>{percentageChange}%</span>}
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
    const handleChange = (e) => {
        const {value} = e.target
        if(value === ""){
            return onChange()
        }
        // Validate the input using regex
        const isValid = /^(\d*\.?\d*)$/.test(value);
        if (isValid) {
            onChange(value);
        }
    }

    return(
        <InputWrapper label={label} id={id}>
            <div className={`flex items-center border border-medium-grey flex-1 rounded-md overflow-hidden ${id === "risk-capital" ? "flex-row-reverse" : ""}`}>
                <span className='p-2 bg-faded-grey text-xs'>{id === "risk-capital" ? "%" : "$"}</span>
                <input 
                    type="number" 
                    id={id} 
                    className='p-2 text-xs flex-1 focus:outline-none bg-white border-none' 
                    value={value || ""}
                    onChange={handleChange}
                />
            </div>
        </InputWrapper>
    )
}

function Warning({text}){
    return <div className='absolute top-0 left-0 w-full h-full bg-faded-grey/10 backdrop-blur-md flex items-center justify-center'>
        <p className='text-red-500'>Stop loss must be {text} entry</p>
    </div>
}

export default TradeCalculator