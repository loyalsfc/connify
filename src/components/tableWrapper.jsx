import { Context } from '@/context/context'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'
import PercentageChangeRow from './percentageChange'
import { formatPrice, getCoinVolume, getImage, numberToString, toTwoDecimalPlace } from '../../utils/utils'

function TableWrapper({isLoading, data, pageIndex, limit}) {
    const {favorites, addToFavorites} = useContext(Context)

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
                        {isLoading === false && 
                            data.map((coin, index) => {
                                const {id, name, quote, symbol, circulating_supply, slug, cmc_rank} = coin
                                const {price, percent_change_1h, percent_change_24h, percent_change_7d, market_cap, volume_24h} = quote?.USD
                                return(
                                    <tr className="border-b border-faded-grey" key={id}>
                                        <td onClick={()=>addToFavorites(id)} className='sticky-item left-0'>
                                            {favorites.some(item => item == id) ? <FaStar/> : <FaRegStar/>}
                                        </td>
                                        <td className='sticky-item left-[34px]'>{cmc_rank}</td> {/*(pageIndex * limit) + (index + 1)*/}
                                        <td className='sticky-item left-[70px] sm:whitespace-nowrap text-left'>
                                            <div className='flex items-center'>
                                                <Image
                                                    src={getImage(id)}
                                                    height={24}
                                                    width={24}
                                                    alt="Logo"
                                                    className='mr-1.5'
                                                />
                                                <Link href={`/coins/${slug}`}>{name} <span className='text-dark-grey'>{symbol}</span></Link>
                                            </div>
                                        </td>
                                        <td className='p-2.5 text-right'>${formatPrice(price)}</td>
                                        <PercentageChangeRow percentChange={percent_change_1h} />
                                        <PercentageChangeRow percentChange={percent_change_24h} />
                                        <PercentageChangeRow percentChange={percent_change_7d} />
                                        <td className='p-2.5'>${toTwoDecimalPlace(market_cap)}</td>
                                        <td className='p-2.5 text-right'>
                                            ${toTwoDecimalPlace(volume_24h)} <br/>
                                            <span className='text-xs text-medium-grey'>{getCoinVolume(volume_24h, price)} {symbol}</span>
                                        </td>
                                        <td className='p-2.5 text-right'>{numberToString(Math.floor(circulating_supply))} {symbol}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </section>
    )
}

export default TableWrapper