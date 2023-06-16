import React from 'react'

function TradeCalculator() {
    return (
        <main className='px-4 md:px-8 bg-[#F8F8F8] mb-8'>
            <section className='md:p-8 pt-4 grid sm:gap-8 grid-cols-1 sm:grid-cols-2 text-sm max-w-3xl mx-auto'>
                <div>
                    <article className='calc-wrapper'>
                        <ItemInput label="Total Capital" id="total-capital" />
                        <ItemInput label="Risk" id="risk-capital" />
                    </article>

                    <article className='calc-wrapper'>
                        <InputWrapper label="Type" id="type">
                            <div className="flex gap-1 p-0.5 border border-medium-grey rounded-md bg-white flex-1">
                                <div className='w-1/2 font-semibold'>
                                    <input className='hidden' type="radio" id='long-type' name='trade-type' value="long" />
                                    <label htmlFor='long-type' className='long-type type-wrapper'>Long</label>
                                </div>
                                <div className='w-1/2'>
                                    <input className='hidden' type="radio" id='short-type' name='trade-type' value="short" />
                                    <label htmlFor='short-type' className='short-type type-wrapper'>Short</label>
                                </div>
                            </div>
                        </InputWrapper>
                        <InputWrapper label="Leverage" id="leverage">
                            <div className='flex-1 flex gap-2 items-center'>
                                <input className='flex-1 slider bg-medium-grey' type="range" id='leverage' min={1} max={100} />
                                <input 
                                    type="number" 
                                    name="" 
                                    id="" 
                                    className='p-2 w-16 bg-white border border-medium-grey text-xs block rounded-[5px]' 
                                />
                            </div>
                        </InputWrapper>
                        <ItemInput label="Entry" id="entry-price" />
                        <ItemInput label="Stop" id="stop-price" />
                        <ItemInput label="Exit" id="exit-price" />
                    </article>
                </div>
                <div className='calc-wrapper text-sm'>
                    <p className='flex justify-between py-1.5'>Risked Capital <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Margin <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Position Size <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Liquidation <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Risk / Reward <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Estimated PnL <span>-</span></p>
                    <p className='flex justify-between py-1.5'>ROE <span>-</span></p>
                    <p className='flex justify-between py-1.5'>Percent <span>-</span></p>
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

function ItemInput({label, id}){
    return(
        <InputWrapper label={label} id={id}>
            <div className={`flex items-center border border-medium-grey flex-1 rounded-md overflow-hidden ${id === "risk-capital" ? "flex-row-reverse" : ""}`}>
                <span className='p-2 bg-faded-grey text-xs'>{id === "risk-capital" ? "%" : "$"}</span>
                <input type="number" id={id} className='p-2 text-xs flex-1 focus:outline-none bg-white border-none' />
            </div>
        </InputWrapper>
    )
}

export default TradeCalculator