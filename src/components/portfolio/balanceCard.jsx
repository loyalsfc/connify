import React from 'react'

function BalanceCard({amount, note}){
    return(
        <div className='rounded-lg shadow-md bg-white p-4 mb-4 mr-2 w-fit'>
            <h5 className='text-xl font-medium'>{amount}</h5>
            <p className='text-sm'>{note}</p>
        </div>
    )
}

export default BalanceCard