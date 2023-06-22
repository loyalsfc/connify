import React from 'react'

function ModalWrapper({hideModal, children}) {
    return (
        <div className='modal'>
            <div onClick={()=>hideModal(false)} className='modal-overlay' />
            <div className='modal-bg'>{children}</div>
        </div>
    )
}

export default ModalWrapper