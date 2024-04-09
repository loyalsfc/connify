import React, { useContext, useState } from 'react'
import ModalWrapper from './modalWrapper'
import CoinList from './portfolio/coinList'
import { Context } from '@/context/context'
import { FaTimes } from 'react-icons/fa'

function AddFavorite({setShowModal}) {
    const {favorites, setFavorites, coins} = useContext(Context)
    const [temporalFavorites, setTemporalFavorites] = useState(favorites.items)
    const coinList = coins?.data?.data?.data;

    function getName(id){
        const coin = coinList.find(item => item.id === id)
        return coin?.name
    }

    const addToWishList = (coin) => {
        if(temporalFavorites.some(item => item == coin.id)){
            removeFromWishList(coin.id);
            return;
        }
        setTemporalFavorites([...temporalFavorites, coin.id])
    }

    const removeFromWishList = (id) => {
        setTemporalFavorites(temporalFavorites.filter(item => item != id))
    }

    const handleClick = () => {
        setFavorites({...favorites, items:temporalFavorites})
        setShowModal(false)
    }

    return (
        <ModalWrapper>
            <div className='h-full flex flex-col gap-4 sm:h-[534px]'>
                <div className='flex-1 overflow-scroll'>
                    <CoinList hideModal={setShowModal} handleClick={addToWishList} />
                </div>
                <div className='flex items-center gap-3 overflow-scroll flex-nowrap'>
                    {temporalFavorites.map(item => {
                        return <div key={item} className='py-1 px-2 rounded-sm bg-faded-grey text-sm flex items-center gap-1 whitespace-pre'>
                                    {getName(item)}
                                    <button onClick={()=>removeFromWishList(item)}><FaTimes /></button>
                                </div>
                    })}
                </div>
                <button onClick={handleClick} className='bg-green-500 w-full py-2 rounded-md font-medium text-white '>Add {temporalFavorites.length} coin</button>
            </div>
        </ModalWrapper>
    )
}

export default AddFavorite