import Calculator from '@/components/tradeCalculator/calculator'
import React from 'react'

export const metadata = {
    title: 'Trade Calculator',
    openGraph: {
        title: 'Trade Calculator',
    },
}

function TradeCalculator() {
    return (
        <main className='px-4 md:px-8 bg-[#F8F8F8] mb-8'>
            <Calculator />
        </main>
    )
}

export default TradeCalculator