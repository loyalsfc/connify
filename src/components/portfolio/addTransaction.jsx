import React, { useContext } from 'react'
import ModalWrapper from '../modalWrapper'
import Transaction from './transaction'
import { supabase } from '@/lib/supabaseClient'
import { Context } from '@/context/context'

function AddTransaction({hideModal, transactions}) {
    let coin = transactions[0].assets
    const {showNotification} = useContext(Context)
    // console.log(

    async function newTransaction(coinQuantity, pricePerCoin, date, type){
        const {error} = await supabase.from('transactions')
            .insert({
                date, 
                price: pricePerCoin, 
                quantity: coinQuantity, 
                total_spent: pricePerCoin * coinQuantity,
                asset: coin.id,
                transaction_type: type,
                asset_slug: coin.slug
            })
            .select()
        if(error) return;
        
        if(type === "buy"){
            await updateAsset({
                holding: coin.holding + parseFloat(coinQuantity), 
                average_fee: getAverageBuy(pricePerCoin, parseFloat(coinQuantity))
            })
        }else {
            await updateAsset({holding: coin.holding - parseFloat(coinQuantity)}) 
        }
        showNotification("Transaction Added", "#22C55E")
        hideModal(false);
    }

    

    // const newTransaction = async(coinQuantity, pricePerCoin, date, type) => {
        
    // }

    async function updateAsset(updateObj){
        await supabase.from('assets')
            .update(updateObj)
            .eq('id', coin.id)
    }

    function getAverageBuy(pricePerCoin, coinQuantity){
        const initialVal = 0
        let totalBuy = transactions.reduce((incr, val) => val.transaction_type === "buy" && incr + val.total_spent, initialVal) 
        totalBuy += (pricePerCoin * coinQuantity)
        const totalQty = coin.holding + coinQuantity
        return totalBuy / totalQty;
    }

    

    return (
        <ModalWrapper hideModal={hideModal}>
            <Transaction coin={coin.coin_name} callbackFunc={newTransaction} hideFunction={hideModal}/>
        </ModalWrapper>
    )
}

export default AddTransaction