import React from 'react'
import NewsLetter from '@/components/newsLetter'
import CoinList from '@/components/coinsList/coinList'
import { makeRequest } from '../../utils/utils'
import { cookies } from 'next/headers'
import CoinsLimit from '@/components/coinsList/coinsLimit'

async function getData(pageIndex){
    const index = pageIndex ?? 1
    const url = `v1/cryptocurrency/listings/latest?start=${((index - 1) * 100) + 1}&limit=100&convert=USD`
    const coins = await makeRequest(url, 'no-store', 60)
    return coins
}

async function getMetrics(){
    const metrics = await makeRequest("v1/global-metrics/quotes/latest", "force-cache", 60)
    return metrics
}

async function Home({searchParams}) {  
    const cookieStore = cookies()
    const limit = cookieStore.get("limit")
    // console.log(limit)
    const coinsData = getData(searchParams.page)
    const metricsData = getMetrics()
    const [coins, metrics] = await Promise.all([coinsData, metricsData])
    
    return (
        <main>
            <CoinList coins={coins} metrics={metrics} />
            <CoinsLimit pageIndex={parseInt(searchParams.page ?? 1)} metrics={metrics} limit={100}/>
            <NewsLetter />
        </main>
    )
}

export default Home
