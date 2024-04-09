import PortFolio from '@/components/portfolio/home/portfolio-home'
import React from 'react'
import { makeRequest } from '../../../utils/utils';

async function getData(pageIndex, limit){
    const index = pageIndex ?? 1;
    const pageLimit = limit ?? 100
    const url = `v1/cryptocurrency/listings/latest?start=${((index - 1) * parseInt(pageLimit)) + 1}&limit=${pageLimit}&convert=USD`
    const coins = await makeRequest(url, 'no-store')
    return coins
}

async function Page() {
    return (
        <PortFolio />
    )
}

export default Page