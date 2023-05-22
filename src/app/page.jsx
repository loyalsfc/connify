'use client'

import React from 'react'
import axios from 'axios'
import useSWR from 'swr'

function Home() {
    const fetcher = (url) => axios.get(url)
    // const fetcher = (...args) => fetch(...args).then(res => res.json())

    const {data: coins, error, isLoading} = useSWR("http://localhost:5000/api/list", fetcher)
    console.log(coins, isLoading)
    return (
        <main>
            <h1 className='text-3xl text-red-700'>Today's Cryptocurrency Prices by Market Cap</h1>
            <div className=''>{'JSON.stringify(coins)'}</div>
            <table className='text-sm mx-auto w-full'>
                <thead>
                    <tr>
                        <th></th>
                        <th>#</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>1h%</th>
                        <th>24h%</th>
                        <th>7d%</th>
                        <th>Market Cap</th>
                        <th>Volume (24h)</th>
                        <th>Circulating Supply</th>
                        <th>Last 7 Days</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading === false && 
                        coins?.data?.data.map(coin => {
                            return(
                                <tr key={coin.id}>
                                    <th></th>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>1h%</th>
                                    <th>24h%</th>
                                    <th>7d%</th>
                                    <th>Market Cap</th>
                                    <th>Volume (24h)</th>
                                    <th>Circulating Supply</th>
                                    <th>Last 7 Days</th>
                                </tr>
                            )
                        })

                    }
                </tbody>
            </table>
        </main>
    )
}

export default Home
