import React from 'react'
import { makeRequestWithRevalidate } from '../../../utils/utils'
import HeaderContent from './headerContent'

async function getMetrics(){
    const res = await makeRequestWithRevalidate('v1/global-metrics/quotes/latest', 60);
    return res
}

async function Header() {
    const metrics = await getMetrics()

    return (
        <header className='flex flex-col-reverse lg:flex-col'>
            <HeaderContent metrics={metrics?.data} />
        </header>
    )
}

export default Header
