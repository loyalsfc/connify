'use client'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { fetcher } from '../../../utils/utils'
import useSWR from 'swr'
import { FaAngleDown } from 'react-icons/fa'
import { Context } from '@/context/context'

function Dropdown({itemCurrency, setItemCurrency}) {
    const {coins} = useContext(Context)
    const itemDisplay = useRef(null)
    const itemElement = useRef(null)
    const itemCurrencyElement = useRef(null)
    const [showList, setShowList] = useState(false)
    const [fiatsList, setFiatsList] = useState([])
    const [coinsList, setCoinsList] = useState([])
    const [filter, setFilter] = useState('')
    const popupRef = useRef(null);
    const wrapper = useRef(null)

    const {data, error, isLoading} = useSWR(
        `/api/fiats`,
        fetcher
    )

    useEffect(()=>{
        setFiatsList(data?.data?.data)
        setCoinsList(coins?.data?.data?.data)
    },[data, coins])

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)  && !wrapper.current.contains(event.target) && wrapper.current != event.target) {
                setShowList(false);
                setFilter('');
                filtering('');
            }
        };
    
        document.addEventListener('click', handleOutsideClick);
    
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);
    
    function handleClick(e, element){
        element.current.focus();
        setShowList(true)
    }

    function handleChange(e){
        const value = e.target.value.toLowerCase();
        itemCurrencyElement.current.classList.add('hidden')
        setFilter(value)
        e.target.style.width = itemDisplay.current.getBoundingClientRect().width + 'px'
        filtering(value);
    }

    function filtering(value){
        setCoinsList(coins?.data?.data?.data.filter(item => item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value)))
        setFiatsList(data?.data?.data.filter(item => item.name.toLowerCase().includes(value) || item.symbol.toLowerCase().includes(value) || item.sign.includes(value) ))
    }

    function handleBlur(e){
        itemCurrencyElement.current.classList.remove('hidden')
    }

    function changeCurrency(e, item){
        setItemCurrency({
            fullName: `${item.name} ${item.sign ?? ''} ${item.symbol}`, 
            symbol: item.symbol, 
            id: item.id
        });
        setShowList(false);
        setFilter('')
        filtering('')
    }

    return (
        <div ref={wrapper} className='w-full sm:w-[calc(50%_-_25px)]'>
            <div className="relative">
                <div onClick={(e)=>handleClick(e, itemElement)} className='flex items-center py-0.5 relative overflow-hidden w-full border border-faded-grey bg-white rounded-lg text-black h-10 text-sm'>
                    <div className='flex-1 overflow-hidden'>
                        <div className='w-full flex items-center py-0.5 px-2 flex-wrap overflow-hidden'>
                            <p ref={itemCurrencyElement} className='mx-0.5 max-w-[calc(100%_-_8px)] overflow-hidden absolute whitespace-nowrap text-ellipsis top-1/2 -translate-y-1/2'>{itemCurrency.fullName}</p>
                            <div className='m-0.5 py-0.5 visible '>
                                <input
                                    className='w-0.5 border-none focus:outline-none outline-none'
                                    type="text" 
                                    autoCapitalize='none' 
                                    autoComplete='off' 
                                    autoCorrect='off' 
                                    ref={itemElement}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={filter}
                                />
                                <span 
                                    ref={itemDisplay} 
                                    className='absolute top-0 left-0 invisible h-0 px-px overflow-scroll whitespace-pre w-fit'
                                >
                                    {filter}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='flex shrink-0 text-gray-300 items-center border-l border-faded-grey justify-center p-2'>
                        <FaAngleDown />
                    </div>
                </div>
                {showList &&
                    <div ref={popupRef} className="w-full top-12 bg-white shadow-md absolute max-h-[300px] overflow-scroll z-50">
                        {fiatsList?.length || coinsList?.length ? (
                            <div className='w-full py-4'>
                                {fiatsList?.length > 0 && <div>
                                    <h3 className='text-medium-grey px-4 mb-1 font-semibold'>Fiat Currencies</h3>
                                    <ul className='mb-4'>
                                        {fiatsList?.map((item, index) =>{
                                            if(index > 10) return
                                            return <li 
                                                key={item.id}
                                                className={`${item.id == itemCurrency.id ? "bg-green-500 text-white" : ""} py-1 px-4 hover:bg-faded-grey cursor-pointer`}
                                                onClick={(e)=>changeCurrency(e, item)}
                                            >
                                                {item.name} {item.sign} {item.symbol}
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                                {coinsList?.length > 0 && <div>
                                    <h3 className='text-medium-grey px-4 mb-1 font-semibold'>Cryptocurrencies</h3>
                                    <ul>
                                        {coinsList?.map((item, index) => {
                                            if(index > 10) return
                                            return <li
                                                key={item.id}
                                                className={`${item.id == itemCurrency.id ? "bg-green-500 text-white" : ""} py-1 px-4 hover:bg-faded-grey cursor-pointer`}
                                                onClick={(e)=>changeCurrency(e, item)}
                                            >
                                                {item.name} {item.symbol}
                                            </li>
                                        })}
                                    </ul>
                                </div>}
                            </div>
                        ):(
                            <p className='font-bold text-medium-grey p-4 text-center'>No options</p>
                        )}
                    </div>
                }
            </div>
        </div>
    )
}

export default Dropdown