import React from 'react'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';


function Pagination({c, m, handleClick}) {
    function paginate() {
        var current = c,
            last = m,
            delta = 2,
            left = current - delta,
            right = current + delta + 1,
            range = [],
            rangeWithDots = [],
            l;
    
        for (let i = 1; i <= last; i++) {
            if (i == 1 || i == last || i >= left && i < right) {
                range.push(i);
            }
        }
    
        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }
    
        return rangeWithDots;
    }
    
    return (
        <div className='flex items-center sm:border border-faded-grey rounded'>
            <button 
                disabled={c == 0 ? true : false}
                className='hover:bg-green-400 h-full block hover:text-white px-2.5 py-1 border-r border-faded-grey'
                onClick={() => handleClick(c - 1)}
            >
                <FaAngleLeft />
            </button>
            {paginate().map((item, index) => {
                return <button 
                            key={index}
                            onClick={()=>handleClick(item - 1)}
                            disabled={item === "..." ? true : false}
                            className={`${c == (item - 1) ? "bg-faded-grey" : ""} px-2.5 py-1 font-medium h-full block hover:bg-green-400 hover:text-white text-sm sm:border-r border-faded-grey`}
                        >
                            {item}
                        </button>
            })
            }
            <button 
                disabled={c == (limit + 1) ? true : false}
                className='hover:bg-green-400 hover:text-white px-2.5 py-1 h-full block'
                onClick={() => handleClick(c + 1)}
            >
                <FaAngleRight />    
            </button>
        </div>
    )
}

function BlaBlaBla(){
    return (
        <div >
                    <button 
                        disabled={pageIndex == 0 ? true : false}
                        className='hover:bg-green-400 h-full block hover:text-white px-2.5 py-1 border-r border-faded-grey'
                        onClick={() => setPageIndex(pageIndex - 1)}
                    >
                        <FaAngleLeft />
                    </button>
                    {!metricsLoading &&
                        <Pagination handleClick={setPageIndex} c={pageIndex} m={Math.ceil(totalCoins / limit)}/>    
                    }
                    <button 
                        disabled={pageIndex == (limit + 1) ? true : false}
                        className='hover:bg-green-400 hover:text-white px-2.5 py-1 h-full block'
                        onClick={() => setPageIndex(pageIndex + 1)}
                    >
                        <FaAngleRight />    
                    </button>
                </div>
    )
}

export default Pagination
