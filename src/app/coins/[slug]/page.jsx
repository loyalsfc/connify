import React from 'react'
import { fetcher, formatPrice, makeRequest, numberToString, toTwoDecimalPlace } from '../../../../utils/utils'
import Image from 'next/image'
import { FaAngleDown, FaAngleUp, FaRegFile, FaBattleNet, FaGithub, FaTwitter, FaRedditAlien, FaCommentDots } from 'react-icons/fa'
import Link from 'next/link'
import CoinToUsd from '@/components/coin-page/coin-page'

async function getCoinData(slug){
    const coinData = await makeRequest(`v2/cryptocurrency/quotes/latest?slug=${slug}`);
    const metaData = await makeRequest(`v2/cryptocurrency/info?slug=${slug}`);
    return {coinData, metaData};
}

export async function generateMetadata({params}, parent){
    const slug = params.slug;
    const exchangeMetadata = await makeRequest(`v2/cryptocurrency/info?slug=${slug}`);

    const id = Object.keys(exchangeMetadata?.data)[0]

    return {
        title: exchangeMetadata?.data[id]?.name,
    }
}

async function CoinPage({params}) {
    const {coinData, metaData} = await getCoinData(params.slug)

    const id = Object.keys(coinData?.data)[0]
    const coinInfo = {...metaData?.data[id], ...coinData?.data[id]}
    const {logo, name, symbol, quote, cmc_rank, circulating_supply, total_supply, max_supply, infinite_supply, description, urls} = coinInfo
    const {market_cap, volume_24h, fully_diluted_market_cap, price} = quote?.USD
    const {technical_doc, website, source_code, twitter, reddit, message_board, explorer} = urls


    function convertLinkToHyperlink(text) {
        // Regular expression to match URLs
        const urlRegex = /(https?:\/\/[^\s]+)/g;
      
        // Replace URLs with JSX hyperlinks
        const replacedText = text.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return (
                <Link href={part} key={index} className='text-blue-colour' target="_blank" rel="noopener noreferrer">
                    {part}
                </Link>
                );
            } else {
                return part;
            }
        });
      
        return replacedText;
    }
    

    return (
        <main className='py-6'>
            <section className='px-4 sm:px-8 flex flex-col sm:flex-row'>
                <article className='sm:pr-8 mb-8 sm:mb-0'>
                    <span className='tag mb-2'>Rank #{cmc_rank}</span>
                    <div className='font-bold flex items-center gap-3 my-4'>
                        <Image
                            src={logo}
                            width={32}
                            height={32}
                            alt="Coin logo"
                        />
                        <h1 className='text-3xl'>{name}</h1>
                        <span className='text-sm py-0.5 px-1.5 bg-faded-grey text-medium-grey rounded'>{symbol}</span>
                    </div> 
                    <div className='flex gap-4 items-center'>
                        <h2 className='font-bold text-2xl text-black'>${formatPrice(price)}</h2>
                        <span 
                            className={`border-md ${quote.USD.percent_change_24h > 0 ? "bg-green-500" :'bg-red-500'} text-white py-[5px] flex items-center font-medium gap-1 rounded-md px-2.5 text-sm'`}
                        >
                            {quote.USD.percent_change_24h > 0 ? <FaAngleUp /> : <FaAngleDown/>} {toTwoDecimalPlace(quote.USD.percent_change_24h)}% 
                        </span>
                    </div>
                    <p className='text-sm mt-4 leading-8'>{convertLinkToHyperlink(description)}</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-8 text-xs mt-8'>
                        <CoinInfo
                            title="Market Cap"
                            value={`$${numberToString(market_cap)}`}
                        />
                        <CoinInfo
                            title="Circulating Supply"
                            value={numberToString(circulating_supply)}
                        />
                        <CoinInfo
                            title="24 Hour Trading Vol"
                            value={`$${numberToString(volume_24h)}`}
                        />
                        <CoinInfo
                            title="Total Supply"
                            value={numberToString(total_supply)}
                        />
                        <CoinInfo
                            title="Fully Diluted Valuation "
                            value={`$${numberToString(fully_diluted_market_cap)}`}
                        />
                        <CoinInfo
                            title="Max Supply"
                            value={infinite_supply ? "∞" : numberToString(max_supply)}
                        />
                    </div>
                </article>
                <div className='sm:w-1/3 md:w-1/4 shrink-0'>
                    <h1 className='mb-2 text-xl font-bold'>Links</h1>
                    <article className='mb-4'>
                        <h4 className='text-sm font-bold text-medium-grey mb-2'>Official Link</h4>
                        <div className='flex flex-wrap gap-2'>
                            <Tags
                                name="Whitepaper"
                                link={technical_doc[0]}
                                Icon={FaRegFile}
                            />
                            <Tags
                                name="Website"
                                link={website[0]}
                                Icon={FaBattleNet}
                            />
                            <Tags
                                name="Github"
                                link={source_code[0]}
                                Icon={FaGithub}
                            />
                        </div>
                    </article>
                    <article className='mb-4'>
                        <h4 className='text-sm font-bold text-medium-grey mb-2'>Social</h4>
                        <div className='flex flex-wrap gap-2'>
                            <Tags
                                name="Twitter"
                                link={twitter[0]}
                                Icon={FaTwitter}
                            />
                            <Tags
                                name="Reddit"
                                link={reddit[0]}
                                Icon={FaRedditAlien}
                            />
                            <Tags
                                name="Chat"
                                link={message_board[0]}
                                Icon={FaCommentDots}
                            />
                        </div>
                    </article>
                    <article>
                        <h4 className='text-sm font-bold text-medium-grey mb-2'>Explorers</h4>
                        <div className='flex flex-wrap gap-2 overflow-hidden'>
                            {explorer.map((item, index) => {
                                    return <a 
                                        href={item} 
                                        key={index}
                                        className='text-xs font-semibold text-medium-grey bg-faded-grey p-0.5 block'
                                    >
                                        {item}
                                    </a>
                                })
                            }
                        </div>
                    </article>
                </div>
            </section>
            <section className='px-4 sm:px-8'>
                <div className='py-8'>
                    <h2 className='text-center font-bold text-2xl'>{name} Converter</h2>
                    <CoinToUsd price={price} symbol={symbol} />
                </div>
            </section>
        </main>
    )
}

function CoinInfo({title, value}){
    return(
        <p className='flex justify-between py-3 border-b border-b-medium-grey text-medium-grey'>
            <span>{title}:</span>
            <span className='font-semibold'>{value}</span>
        </p>
    )
}

function Tags({Icon, name, link}){
    return(
        <a href={link}>
            <span className='text-xs cursor-pointer font-semibold flex items-center gap-1 w-fit py-0.5 px-1.5 bg-faded-grey text-medium-grey rounded'>
                <Icon />
                {name}
            </span>
        </a>
    )
}

export default CoinPage