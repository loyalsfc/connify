import React, { useContext } from 'react'
import ModalWrapper from '../modalWrapper'
import Transaction from './transaction'
import { supabase } from '@/lib/supabaseClient'
import { Context } from '@/context/context'

function AddTransaction({hideModal, transactions}) {
    let coin = transactions[0].assets
    const {showNotification} = useContext(Context)

    async function newTransaction(coinQuantity, pricePerCoin, date, type, transferType){
        const {error} = await supabase.from('transactions')
            .insert({
                date, 
                price: pricePerCoin, 
                quantity: coinQuantity, 
                total_spent: pricePerCoin * coinQuantity ?? null,
                asset: coin.id,
                transaction_type: type,
                transfer_type: transferType ?? "",
                asset_slug: coin.slug
            })
            .select()
        if(error) return;
        
        if(type === "buy"){
            await updateAsset({
                holding: coin.holding + parseFloat(coinQuantity), 
                average_fee: getAverageBuy(pricePerCoin, parseFloat(coinQuantity))
            })
        }else if (type === "sell"){
            await updateAsset({holding: coin.holding - parseFloat(coinQuantity)}) 
        } else {
            if(transferType === "in"){
                await updateAsset({holding: coin.holding + parseFloat(coinQuantity)})
            } else {
                await updateAsset({holding: coin.holding - parseFloat(coinQuantity)}) 
            }
        }
        showNotification("Transaction Added", "#22C55E");
        hideModal(false);
    }

    async function updateAsset(updateObj){
        await supabase.from('assets')
            .update(updateObj)
            .eq('id', coin.id)
    }

    function getAverageBuy(pricePerCoin, coinQuantity){
        let totalBuy = 0
        transactions.forEach(item => {
            if(item.transaction_type === "buy"){
                return totalBuy += item.total_spent
            }
        })
        totalBuy += (pricePerCoin * coinQuantity)
        let totalQty = 0;
        transactions.forEach(item => {
            if(item.transaction_type === "buy"){
                return totalQty += item.quantity
            }
        })
        totalQty += coinQuantity;
        return totalBuy / totalQty;
    }

    return (
        <ModalWrapper hideModal={hideModal}>
            <Transaction coin={coin.coin_name} callbackFunc={newTransaction} hideFunction={hideModal}/>
        </ModalWrapper>
    )
}

export default AddTransaction