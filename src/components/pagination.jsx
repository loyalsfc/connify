import React from 'react'


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
        <>
            {paginate().map((item, index) => {
                return <button 
                            key={index}
                            onClick={()=>handleClick(item - 1)}
                            disabled={item === "..." ? true : false}
                            className={`${c == (item - 1) ? "bg-faded-grey" : ""} px-2.5 py-1 font-medium h-full block hover:bg-green-400 hover:text-white text-sm border-r border-faded-grey`}
                        >
                            {item}
                        </button>
            })
            }
        </>
    )
}

export default Pagination
