import React from 'react'
import ModalWrapper from '../modalWrapper'

function DeleteModal({hideModal, heading, content, deleteFunc}) {
    async function deleteAsset(e){
        e.target.disabled = true;
        await deleteFunc();
        e.target.disabled = false;
    }

    return (
        <ModalWrapper hideModal={hideModal}>
            <div className='py-4 pt-6'>
                <h2 className='font-bold text-2xl mb-2'>{heading}</h2>
                <p className='text-sm font-semibold mb-4'>{content}</p>
                <div className='flex flex-col gap-3'>
                    <button onClick={deleteAsset} className='group full-btn bg-red-500'>
                        <p className="loader hidden group-disabled:block"></p>
                        Delete
                    </button>
                    <button onClick={()=>hideModal(false)} className='p-3 w-full rounded-md font-bold text-sm bg-faded-grey hover:bg-medium-grey/50'>Cancel</button>
                </div>
            </div>
        </ModalWrapper>
    )
}

export default DeleteModal