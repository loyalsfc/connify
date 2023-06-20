'use client'

import React, { useContext } from 'react'
import { Context } from '../../context'

function GeneralLayout({children}) {
    const {notificationRef} = useContext(Context)
    return (
        <section>
            <div className="fixed top-0 right-0 w-full p-4 pointer-events-none z-[9999]" ref={notificationRef}>
                
            </div>
            {children}
        </section>
    )
}

export default GeneralLayout