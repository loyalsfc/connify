import React from 'react'
import { makeRequestWithRevalidate } from '../../../utils/utils'
import HeaderContent from './headerContent'

async function getMetrics(){
    const metrics = await makeRequestWithRevalidate('v1/global-metrics/quotes/latest', 60);
    const exchanges = await makeRequestWithRevalidate('v1/exchange/map?sort=volume_24h', 60);
    return {metrics, exchanges};
}

async function Header() {

    // const {data: exchanges} = useSWR(
    //     ``,
    //     fetcher
    // )
    const {metrics, exchanges} = await getMetrics()

    return (
        <header className='flex flex-col-reverse lg:flex-col'>
            <HeaderContent metrics={metrics?.data} exchanges={exchanges?.data} />
        </header>
    )
}

export default Header
