import React, { useContext } from 'react'
import ModalWrapper from '../modalWrapper'
import { supabase } from '@/lib/supabaseClient'
import { PortfolioContext } from '@/context/portfolioContext'
import { Context } from '@/context/context';

function DeleteAsset({hideModal, id}) {
    const {deletePortfolio} = useContext(PortfolioContext);
    const {showNotification} = useContext(Context);

    const deleteAsset = async() => {
        const {data, error} = await supabase.from('assets').delete().eq('id', id)
        if(error){
            showNotification('An error occured', '#EF4444');    
            return;
        }
        deletePortfolio(id)
        showNotification('Asset Deleted Successfully', '#22655E');
        hideModal(false)
    }

    return (
        <ModalWrapper hideModal={hideModal}>
            <div className='py-4 pt-6'>
                <h2 className='font-bold text-2xl mb-2'>Delete this asset?</h2>
                <p className='text-sm font-semibold mb-4'>All transactions linked to this asset will be deleted.</p>
                <div className='flex flex-col gap-3'>
                    <button onClick={deleteAsset} className='p-3 w-full rounded-md font-bold text-sm bg-red-500 text-white'>Delete</button>
                    <button onClick={()=>hideModal(false)} className='p-3 w-full rounded-md font-bold text-sm bg-faded-grey hover:bg-medium-grey/50'>Cancel</button>
                </div>
            </div>
        </ModalWrapper>
    )
}

export default DeleteAsset