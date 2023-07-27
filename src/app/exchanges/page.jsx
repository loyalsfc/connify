import React from 'react'
import { makeRequestWithRevalidate } from '../../../utils/utils'
import ExchangeContent from '@/components/exchanges/exchangeContent';

async function getExchanges(){
    const res = makeRequestWithRevalidate("v1/exchange/map?sort=volume_24h", 60);
    return res;
}

export const metadata = {
    title: "Exchanges"
}

async function Exchanges() {
    const exchanges = await getExchanges();

    return (
        <main>
            <section className='mt-8 mb-12 px-4 sm:px-8'>
                <h1 className='text-sm md:text-2xl font-bold mb-2'>Top Crypto Exchanges Ranked by Trust Score</h1>
                <p className='text-sm'>As of today, we track 679 crypto exchanges with a total 24h trading volume of $56.8 Billion, a -2.66% change in the last 24 hours. Currently, the 3 largest cryptocurrency exchanges are Binance, Coinbase Exchange, and Bybit. Total tracked crypto exchange reserves currently stands at $105 Billion</p>
                <h4 className="text-center text-2xl font-bold mt-8">Exchanges</h4>
                <ExchangeContent exchanges={exchanges?.data} />                
            </section>
        </main>
    )
}

export default Exchanges