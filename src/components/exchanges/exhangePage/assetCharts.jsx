'use client'
import React from 'react'

import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import Image from 'next/image';
import { getImage } from '../../../../utils/utils';

ChartJS.register(ArcElement, Tooltip);

const allocations = [
    {
        id: 1,
        symbol: 'BTC',
        percentage: 26.46
    },
    {
        id: 825,
        symbol: 'USDT',
        percentage: 26.39
    },
    {
        id: 1839,
        symbol: 'BNB',
        percentage: 14.00
    },
    {
        id: 1027,
        symbol: 'ETH',
        percentage: 11.43
    },
    {
        id: 4687,
        symbol: 'BUSD',
        percentage: 4.71
    },
    {
        id: 1111,
        symbol: 'OTHER',
        percentage: 26.39
    },
]

function AssetCharts({assets}) {
    const coinData = {
        labels: allocations.map(item => item.symbol),
        datasets: [
            {
                label: '% of Assets',
                data: allocations.map(item => item.percentage),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        legend: {
          display: false
        }
    };

    return (
        <div className='w-2/3 mx-auto'>
            {assets?.length ?<div>
                <Doughnut data={coinData} options={options} />
                <ul className='py-4'>
                    {allocations.map(item=>{
                        return <li key={item.id} className='p-1.5 flex items-center gap-4 rounded-lg font-semibold hover:bg-faded-grey'>
                            <div className='shrink-0 h-5 w-5'>
                                <Image
                                    src={getImage(item.id)}
                                    height={20}
                                    width={20}
                                    alt='Coin Logo'
                                />
                            </div>
                            <span>{item.symbol}</span>
                            <span className='ml-auto'>{item.percentage.toFixed(2)}%</span>
                        </li>
                    })}
                </ul>
            </div>
            : <div className='py-20 text-center italic'>No data to show</div>}
        </div>
    )
}

export default AssetCharts