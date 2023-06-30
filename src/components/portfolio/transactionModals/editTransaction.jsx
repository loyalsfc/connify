import ModalWrapper from '@/components/modalWrapper'
import React, { useContext, useRef, useState } from 'react'
import { DateComp } from '../transaction'
import { FaTimes } from 'react-icons/fa'
import { formatPrice, getImage } from '../../../../utils/utils'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import { Context } from '@/context/context'

function EditTransaction({id, callbackFunc, hideFunction, transaction, assets}) {
    const currentTransaction = transaction.find(item => item.id === id)
    const {transaction_type: type, transfer_type, price, quantity, date: initialDate} = currentTransaction
    const {id: assetId, coin_name, holding, average_fee} = assets
    const [pricePerCoin, setPricePerCoin] = useState(price)
    const [coinQuantity, setCoinQuantity] = useState(quantity)
    const [date, setDate] = useState(new Date(initialDate).toISOString().slice(0, 16))
    const [transferType, setTransferType] = useState(transfer_type)
    const {showNotification} = useContext(Context)
    const submitBtn = useRef()

    const handleSubmit = async(e) => {
        e.preventDefault();
        submitBtn.current.disabled = true;
        const {data, error} = await supabase.from('transactions')
            .update({
                date, 
                price: parseFloat(pricePerCoin), 
                quantity: parseFloat(coinQuantity), 
                total_spent: pricePerCoin * coinQuantity ?? null
            })
            .eq('id', id);

        if(error){
            showNotification("An error occured", "#EF4444");
            return;
        }

        if(type === "buy"){
            const currentHolding = (holding - quantity) + parseFloat(coinQuantity);
            await updateAsset({holding: currentHolding, average_fee: getAverageCost()})
        } else if (type === "sell" || transfer_type === "out" ){
            const currentHolding = (holding + quantity) - parseFloat(coinQuantity);
            await updateAsset({holding: currentHolding})
        } else {
            const currentHolding = (holding - quantity) + parseFloat(coinQuantity);
            await updateAsset({holding: currentHolding})
        }
        submitBtn.current.disabled = false;
        showNotification("Transaction Updated Successfully", "#22C55E")   
        callbackFunc();     
        hideFunction();
    }

    function getAverageCost (){
        const filteredTransaction = transaction.filter(item => item.id !== id);
        let totalBuy = filteredTransaction.reduce((incr, item) => {
            if(item.transaction_type === "buy"){
                return incr + item.total_spent
            }
            return incr
        }, 0)
        totalBuy += (parseFloat(pricePerCoin) * parseFloat(coinQuantity));
        let totalQty = filteredTransaction.reduce((incr, item) => {
            if(item.transaction_type === "buy"){
                return incr + item.quantity
            }
            return incr
        }, 0)
        totalQty += parseFloat(coinQuantity);
        return totalBuy / totalQty;
    }

    async function updateAsset(updateObj){
        await supabase.from('assets')
            .update(updateObj)
            .eq('id', assetId)
    }

    return (
        <ModalWrapper hideModal={hideFunction}>
            <div>
                <h1 className="text-lg sm:text-xl font-semibold flex items-center justify-between py-4">
                    Edit Transaction
                    <button onClick={()=>hideFunction(false)}><FaTimes/> </button>
                </h1>
                {type !== "transfer" ? (<form onSubmit={handleSubmit}>
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
                                    src={getImage(coin_name.id)}
                                    height={24}
                                    width={24}
                                    alt='Coin Logo'
                                />
                                {coin_name.symbol}
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
                        <button ref={submitBtn} className='submit-button group'>
                            <p className="loader hidden group-disabled:block"></p>
                            Submit
                        </button>
                    </div>
                </form>):(
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
                                    src={getImage(coin_name.id)}
                                    height={24}
                                    width={24}
                                    alt='Coin Logo'
                                />
                                {coin_name.symbol}
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
                        <button ref={submitBtn} className='submit-button group'>
                        <p className="loader hidden group-disabled:block"></p>
                            Submit
                        </button>
                    </div>
                </form>
                )}
            </div>
        </ModalWrapper>
    )
}

export default EditTransaction