import React from 'react'

function TableWrapper({children}) {
    return (
        <section className='px-4 sm:px-8 overflow-hidden'>
            <div className='relative overflow-x-scroll'>
                <table className='text-sm border-collapse w-full mb-1 sm:mb-4'>
                    <thead className="sticky top-0 bg-white">
                        <tr className='sticky top-0 border-y border-faded-grey'>
                            <th className='sticky-item left-0 cursor-pointer'></th>
                            <th className='sticky-item left-[34px] cursor-pointer'>#</th>
                            <th className='sticky-item left-[70px] cursor-pointer'>Name</th>
                            <th className='p-2.5 cursor-pointer'>Price</th>
                            <th className='p-2.5 cursor-pointer'>1h%</th>
                            <th className='p-2.5 cursor-pointer'>24h%</th>
                            <th className='p-2.5 cursor-pointer'>7d%</th>
                            <th className='p-2.5 cursor-pointer'>Market Cap</th>
                            <th className='p-2.5 cursor-pointer'>Volume (24h)</th>
                            <th className='p-2.5 cursor-pointer'>Circulating Supply</th>
                        </tr>
                    </thead>
                    <tbody className='font-semibold'>
                        {children}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default TableWrapper