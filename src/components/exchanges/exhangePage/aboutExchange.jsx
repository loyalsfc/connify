'use client'

import Link from 'next/link';
import React, { useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

function AboutExchange({description}) {
    const [showLess, setShowLess] = useState(true)

    const convertTextToHTML = (text) => {
        const linkRegex = /\[(.*?)\]\((.*?)\)/g;
        let result;
        const parts = [];
      
        let lastIndex = 0;
        while ((result = linkRegex.exec(text))) {
            const linkText = result[1];
            const linkHref = result[2];
        
            parts.push(text.substring(lastIndex, result.index));
            parts.push({ linkText, linkHref });
        
            lastIndex = result.index + result[0].length;
        }
        parts.push(text.substring(lastIndex));
      
        return parts.map((part, index) => {
            if (typeof part === "object") {
                const { linkText, linkHref } = part;
                return (
                <Link href={linkHref ?? ""} key={index}>
                    <span className='text-blue-colour'>{linkText}</span>
                </Link>
                );
            } else {
                return <span key={index}>{part}</span>;
            }
        });
    };

    return (
        <div className=''>
            <div className={showLess ? 'display-less' : ""}>
                {
                    description.split('\n').map((item, index) => {
                        if(item.includes('##')){
                            return <h2 className='font-bold py-4' key={index}>{item.replace('##', '')}</h2>
                        } else {
                            return <p className='text-sm' key={index}>{convertTextToHTML(item)}</p>    
                        }
                    })
                }
            </div>
            <button onClick={()=>setShowLess(!showLess)} className='text-medium-grey sm:text-blue-colour bg-faded-grey sm:bg-transparent w-full mt-4 sm:w-fit grid place-content-center py-2 sm:py-3 rounded-md font-bold text-sm'>
                {showLess ? <span className='flex items-center'> Show More <FaAngleDown /></span> : <span className='flex items-center'> Show Less <FaAngleUp    /></span>}
            </button>
        </div>
    )
}

export default AboutExchange