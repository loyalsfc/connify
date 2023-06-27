import React, { useContext } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { PortfolioContext } from '@/context/portfolioContext'
import { Context } from '@/context/context';
import DeleteModal from './deleteModal';

function DeleteAsset({hideModal, id}) {
    const {deletePortfolio} = useContext(PortfolioContext);
    const {showNotification} = useContext(Context);

    const deleteAsset = async() => {
        const {error} = await supabase.from('assets').delete().eq('id', id)
        if(error){
            showNotification('An error occured', '#EF4444');    
            return;
        }
        deletePortfolio(id)
        showNotification('Asset Deleted Successfully', '#22655E');
        hideModal(false)
    }

    return (
        <DeleteModal
            hideModal={hideModal}
            heading="Delete this asset?"
            content="All transactions linked to this asset will be deleted."
            deleteFunc={deleteAsset}
        />
    )
}

export default DeleteAsset