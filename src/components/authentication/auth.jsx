'use client'

import React, { useContext, useState } from 'react'
import {Login, Register} from './login'
import { FaTimes } from 'react-icons/fa'
import { Context } from '../../../context'

function Auth() {   
    const {showAuthModal, setShowAuthModal} = useContext(Context);

    const [showLogin, setShowLogin] = useState(true)
    return (
        <>
            {showAuthModal.isShown && <div className='fixed top-0 left-0 h-screen w-full bg-black/20 z-50 '>
                <div onClick={()=>setShowAuthModal({...showAuthModal, isShown: false})} className='a top-0 left-0 h-full w-full bg-black/20' />
                <div className='absolute z-50 top-1/2 max-h-[95%] left-1/2 w-[498px] overflow-scroll -translate-x-1/2 p-6 pt-0 -translate-y-1/2 bg-white shadow-md rounded-2xl transition-all'>
                    <button onClick={()=>setShowAuthModal({...showAuthModal, isShown: false})} className="fixed right-6 top-6 z-50"><FaTimes /></button>
                    <p className='flex justify-center gap-4 font-semibold sticky top-0 pt-6 z-40 bg-white'>
                        <button onClick={()=>setShowAuthModal({...showAuthModal, type: 'login'})} className={`${showAuthModal.type === "login" ? "border-b-2 border-green-500" : ""} pb-1 text-lg text-semibold hover:text-green-500`}>Log In</button>
                        <button onClick={()=>setShowAuthModal({...showAuthModal, type: 'sign-up'})} className={`${showAuthModal.type === "sign-up" ? "border-b-2 border-green-500" : ""} pb-1 text-lg text-semibold hover:text-green-500`}>Sign Up</button>
                    </p>
                    <div>
                        {showAuthModal.type === "login" ? <Login /> : <Register />}
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Auth