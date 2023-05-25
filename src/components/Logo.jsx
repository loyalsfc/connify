import React from 'react'
import Image from 'next/image'
function Logo() {
    return (
        <h1 className='flex items-center font-bold text-2xl gap-2'>
            <Image
                src="/logo.jpg"
                height="40"
                width="40"
                alt="Logo"
            />
            Coinnify 
        </h1>
    )
}

export default Logo
