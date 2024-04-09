import ModalWrapper from '@/components/modalWrapper'
import React, { useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { formatDate, formatPrice } from '../../../../utils/utils'

function TransactionDetails({hideModal, transaction, showDelete, showEdit, coin_name}) {
    const {transaction_type, date, price, quantity, fee, total_spent, note, transfer_type} = transaction[0]
    return (
        <ModalWrapper hideModal={hideModal}>
            <div className='py-5 sm:py-0 h-full sm:h-fit flex flex-col'>
                <h2 className='text-lg font-medium sm:text-xl flex justify-between items-center mb-3'>
                    Transaction Details
                    <button onClick={()=>hideModal(false)} className='text hover:scale-110 transition-all'><FaTimes/></button>
                </h2>
                <ul>
                    <li className='transaction-details'>
                        Type 
                        <span className='capitalize text-main-color'>{transaction_type} {transfer_type ?? ""}</span>
                    </li>
                    <li className='transaction-details'>Date <span className='text-main-color'>{formatDate(date)}</span></li>
                    {transaction_type !== "transfer" && <li className='transaction-details'>Price <span className='text-main-color'>{formatPrice(price)}</span></li>}
                    <li className='transaction-details'>Quantity <span className='text-main-color'>{quantity}{coin_name.symbol}</span></li>
                    <li className='transaction-details'>Fees <span className='text-main-color'>{fee ?? 'No Fee'}</span></li>
                    {transaction_type !== "transfer" && <li className='transaction-details'>Total Received <span className='text-main-color'>{formatPrice(total_spent)}</span></li>}
                    <li className='px-1 py-2 text-medium-grey/90 border-b border-faded-grey'>
                        Notes 
                        <p className='text-main-color py-2'>{note ?? "--"}</p>
                    </li>
                </ul>
                <div className='mt-auto sm:hidden'>
                    <button onClick={()=>showEdit(true)} className='full-btn bg-green-500'>Edit Transaction</button>
                    <button onClick={()=>showDelete(true)} className="font-semibold w-full py-3 mt-2 text-red-500 text-sm">Delete Transaction</button>
                </div>
            </div>
        </ModalWrapper>
    )
}

export default TransactionDetails