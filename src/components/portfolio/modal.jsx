import React, { useContext, useState } from 'react'
import { FaAngleRight, FaTimes } from 'react-icons/fa'
import { getImage } from '../../../utils/utils'
import Image from 'next/image'
import { Context } from '../../context/context'
import Transaction from './transaction'
import ModalWrapper from '../modalWrapper'
import { PortfolioContext } from '@/context/portfolioContext'
import { supabase } from '@/lib/supabaseClient'

function Modal({hideModal, mutate}) {
    const [currentPage, setCurrentPage] = useState('coin-select')
    const [selectedCoin, setSelectedCoin] = useState()
    const {user, coins} = useContext(Context)
    const {updatePortfolio, portfolioId} = useContext(PortfolioContext)
    const [filter, setFilter] = useState('')

    function handleClick(coin){
        setSelectedCoin(coin)
        setCurrentPage('transaction')
    }
    
    function filterFunction(item){
        return item.symbol.toLowerCase().includes(filter.toLowerCase()) || item.name.toLowerCase().includes(filter.toLowerCase())
    }

    const createAsset = async(coinQuantity, pricePerCoin, date, type) => {
        const {data: asset} = await supabase.from('assets')
            .insert({
                coin_name: selectedCoin, 
                portfolio: portfolioId, 
                user_id: user?.id, 
                holding: coinQuantity,
                average_fee: pricePerCoin,
                slug: selectedCoin.slug
            })
            .select()
        await supabase.from('transactions')
            .insert({
                date, 
                price: pricePerCoin, 
                quantity: coinQuantity, 
                total_spent: pricePerCoin * coinQuantity,
                asset: asset[0].id,
                transaction_type: type,
                asset_slug: selectedCoin.slug,
            })
        mutate();
        hideModal(false);
    }

    return (
            <ModalWrapper hideModal={hideModal}>
                {currentPage === "coin-select" && <div className='flex flex-col h-full sm:h-[534px]'>
                    <h2 className='text-lg sm:text-2xl font-bold flex justify-between mt-4'>Select Coin <button onClick={()=>hideModal(false)} className='text-medium-grey/50'><FaTimes/></button></h2>
                    <div className='py-3'>
                        <input 
                            type="search" 
                            className='text-sm px-3 py-2 border-medium-grey border focus:border-green-500 focus:outline-none rounded-md w-full' 
                            value={filter}
                            onChange={(e)=>setFilter(e.target.value)}
                        />
                    </div>
                    <div className='flex-1 overflow-scroll'>
                        {coins?.data?.data?.data?.filter(filterFunction).length ? (<ul> 
                            {
                                coins?.data?.data?.data?.filter(filterFunction)
                                    .map((coin, index) => {
                                        if(index > 29) return;
                                        return(
                                            <li key={coin.id} onClick={()=>handleClick(coin)} className='flex font-semibold items-center py-2 cursor-pointer hover:bg-faded-grey gap-2'>
                                                <Image
                                                    src={getImage(coin.id)}
                                                    height={24}
                                                    width={24}
                                                    alt='Coin'
                                                />
                                                <span>{coin.name}</span>
                                                <span className='opacity-50'>{coin.symbol}</span>
                                                <button className='ms-auto'>
                                                    <FaAngleRight />
                                                </button>
                                            </li>
                                        )
                                    })
                            }
                        </ul>):(<p className='font-bold text-medium-grey text-center mt-4'>No Option Match</p>)}
                    </div>
                </div>}
                {currentPage === "transaction" && <Transaction hideFunction={hideModal} callbackFunc={createAsset} coin={selectedCoin} />}
            </ModalWrapper>
    )
}

export default Modal