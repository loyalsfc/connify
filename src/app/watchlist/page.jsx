'use client'

import NewsLetter from '@/components/newsLetter'
import TableWrapper from '@/components/tableWrapper'
import React from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'

function Favorites() {
    const {data, error, isLoading} = useSWR(
        ``,
        fetcher
    )
    return (
        <main className='py-8'>
            <TableWrapper>
                
            </TableWrapper>
            <NewsLetter />
        </main>
    )
}

export default Favorites