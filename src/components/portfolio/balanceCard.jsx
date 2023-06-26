import React from 'react'

function BalanceCardWrapper({amount, children}){
    return(
        <div className='rounded-lg shadow-md bg-white p-4 mb-4 mr-2 w-fit'>
            <h5 className='text-xl font-medium'>{amount}</h5>
            {children}
        </div>
    )
}

function BalanceCard({amount, note}){
    return(
        <BalanceCardWrapper amount={amount}>
            <p className='text-sm'>{note}</p>
        </BalanceCardWrapper>
    )
}

export function ProfitCard({amount, percentage}){
    return(
        <BalanceCardWrapper amount={amount}>
            <p className='text-sm'>Profit / Loss (<span className={percentage > 0 ? "text-green-500" : "text-red-500"}>
                {percentage}%</span>)
            </p>
        </BalanceCardWrapper>
    )
}

export default BalanceCard