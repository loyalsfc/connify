'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

function LoginComponent({isLogin, auth}) {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async(e) => {
        setIsLoading(true)
        e.preventDefault();
        await auth(formData);
        setIsLoading(false)
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setFormData({...formData, [e.target.id]: value})
    }

    return (
        <>
            <div className='my-4'>
                <button className='w-full'>
                    <SocialLogin 
                        icon="https://static.coingecko.com/s/google-167c1e093ccfc014420e14da91325a1f70c91e592f58164fefe84603d2fde02e.svg"
                        name="Google"
                    />
                </button>
                <button className='w-full'>
                    <SocialLogin 
                        icon="/github.png"
                        name="Github"
                    />
                </button>
            </div>
            <div className='flex items-center'>
                <div className='flex-1 h-px bg-faded-grey'/>
                <span className='px-1'>OR</span> 
                <div className='flex-1 h-px bg-faded-grey'/>
            </div>
            <form onSubmit={handleSubmit}>
                <LoginInput type="email">
                    <input 
                        type='email'
                        name="email"
                        id="email"
                        autoComplete="email"
                        placeholder="email"
                        className='auth-input'
                        value={formData.email}
                        onChange={handleChange}
                    />
                </LoginInput>
                <LoginInput type="password">
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            id="password"
                            autoComplete="password"
                            placeholder="password"
                            className='auth-input w-full'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button 
                            onClick={()=>setShowPassword(!showPassword)}
                            type='button' 
                            className="absolute right-4 -translate-y-1/2 text-lg top-1/2"
                        >
                            {showPassword ? <FaEyeSlash/>:<FaEye />}
                        </button>
                    </div>
                </LoginInput>
                {!isLogin && <div className='flex gap-3 items-center text-sm font-bold mb-2'>
                    <input type="checkbox" name="subscribe" id="subscribe" />
                    <label htmlFor="subscribe">I would like to subscribe to Connify's daily newsletter.</label>
                </div>}
                {isLogin && <p className='text-xs font-semibold text-right mb-2'>Forget password</p>}
                <button 
                    disabled={formData.email === "" || formData.password === "" ? true : false} 
                    className='p-3 w-full bg-green-500 disabled:bg-green-500/40 disabled:cursor-not-allowed disabled:pointer-events-auto rounded-lg text-white font-bold'
                >
                    {isLoading ? 
                        <span className='block h-6 w-6 border-4 border-white mx-auto animate-spin border-t-white/80 rounded-full'></span>:
                        <>{isLogin ? "Login" : "Register"}</>
                    }
                </button>
                {!isLogin && <p className='text-center mt-4 text-sm max-w-xs font-semibold mx-auto'>By proceeding, you agree to Connify’s <span className='text-green-500 cursor-pointer'>Terms of Use</span> & <span className='text-green-500 cursor-pointer'>Privacy Policy.</span></p>}
            </form>
        </>
    )
}

function LoginInput({type, children}){
    return(
        <div className='flex flex-col text-sm font-semibold mb-4'>
            <label htmlFor={type} className='capitalize leading-9'>{type}:</label>
            {children}
        </div>
    )
}

function SocialLogin({icon, name}){
    return <span className='relative block py-3 px-5 text-sm font-semibold shadow-sm first:mb-4 rounded-md border border-faded-grey text-center'>
        <span className='absolute top-1/2 -translate-y-1/2 left-5'>
            <Image 
                src={icon}
                height={20}
                width={20}
                alt="social"
            />
        </span>
        Continue with {name}
    </span>
}

export default LoginComponent