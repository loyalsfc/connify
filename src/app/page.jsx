import React from 'react'
import NewsLetter from '@/components/newsLetter'
import CoinList from '@/components/coinsList/coinList'
import { makeRequest, makeRequestWithRevalidate } from '../../utils/utils'
import { cookies } from 'next/headers'
import CoinsLimit from '@/components/coinsList/coinsLimit'

async function getData(pageIndex, limit){
    const index = pageIndex ?? 1;
    const pageLimit = limit ?? 100
    const url = `v1/cryptocurrency/listings/latest?start=${((index - 1) * parseInt(pageLimit)) + 1}&limit=${pageLimit}&convert=USD`
    // const coins = await makeRequest(url, 'no-store')
    const res = await fetch(process.env.NEXT_PUBLIC_URL + `/api/cryptocurrencies?start=${((index - 1) * parseInt(pageLimit)) + 1}&limit=${pageLimit}&convert=USD`, {
        headers: {
            "content-type": "application/json",
            'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY
        },
        cache: "no-store",
    })

    return res.json();
    // return coins
}

async function getMetrics(){
    const metrics = await makeRequestWithRevalidate("v1/global-metrics/quotes/latest", 60)
    return metrics
}

async function Home({searchParams}) {  
    const cookieStore = cookies()
    const limit = cookieStore.get("limit")
    const coinsData = getData(searchParams.page, limit?.value)
    const metricsData = getMetrics()
    const [coins, metrics] = await Promise.all([coinsData, metricsData])

    console.log(coins)
    
    return (
        <main>
            <CoinList coins={coins} metrics={metrics} />
            <CoinsLimit pageIndex={parseInt(searchParams.page ?? 1)} metrics={metrics} limit={limit?.value ?? 100}/>
            <NewsLetter />
        </main>
    )
}

export default Home
