import React from 'react'
import Image from 'next/image'

function Loader() {
    return (
        <div className='h-[80vh] flex items-center justify-center'>
            <Image
                src="/loader.webp"
                height="150"
                width="150"
                alt="Loader"
            />
        </div>
    )
}

export default Loader