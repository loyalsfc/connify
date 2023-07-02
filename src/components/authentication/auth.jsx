'use client'

import React, { useContext, useState } from 'react'
import {Login, Register} from './login'
import { FaTimes } from 'react-icons/fa'
import { Context } from '../../context/context'

function Auth() {   
    const {showAuthModal, setShowAuthModal} = useContext(Context);

    return (
        <>
            {showAuthModal.isShown && <div className='modal z-[9999]'>
                <div onClick={()=>setShowAuthModal({...showAuthModal, isShown: false})} className='modal-overlay' />
                <div className='modal-bg'>
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