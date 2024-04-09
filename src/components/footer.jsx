'use client'

import React from 'react'
import Logo from './Logo'
import { FaAngleDown } from 'react-icons/fa'

function Footer() {
    return (
        <footer className='px-4 md:px-8'>
            <div className="flex flex-col md:flex-row items-start justify-between">
                <Logo className="mb-4 md:mb-0" />
                <br className='md:hidden mb-4'/>
                <ListComponent title="About">
                    <li className="hover:underline cursor-pointer">About Us</li>
                    <li className="hover:underline cursor-pointer">Careers Join Us</li>
                    <li className="hover:underline cursor-pointer">Company Blog</li>
                    <li className="hover:underline cursor-pointer">Branding Guide</li>
                    <li className="hover:underline cursor-pointer">Disclaimer</li>
                    <li className="hover:underline cursor-pointer">Terms of Service</li>
                    <li className="hover:underline cursor-pointer">Privacy Policy</li>
                    <li className="hover:underline cursor-pointer">Ad Policy</li>
                </ListComponent>
                <ListComponent title="Community">
                    <li className="hover:underline cursor-pointer">Twitter</li>
                    <li className="hover:underline cursor-pointer">Telegram Chat</li>
                    <li className="hover:underline cursor-pointer">Telegram News</li>
                    <li className="hover:underline cursor-pointer">Instagram</li>
                    <li className="hover:underline cursor-pointer">Reddit</li>
                    <li className="hover:underline cursor-pointer">Discord</li>
                    <li className="hover:underline cursor-pointer">Facebook</li>
                    <li className="hover:underline cursor-pointer">Youtube</li>
                    <li className="hover:underline cursor-pointer">TikTok</li>
                </ListComponent>        
                <ListComponent title="Support">
                    <li className="hover:underline cursor-pointer">Request Form</li>
                    <li className="hover:underline cursor-pointer">Advertising</li>
                    <li className="hover:underline cursor-pointer">Candy Rewards Listing</li>
                    <li className="hover:underline cursor-pointer">Help Center</li>
                    <li className="hover:underline cursor-pointer">Bug Bounty</li>
                    <li className="hover:underline cursor-pointer">FAQ</li>
                </ListComponent>   
                <ListComponent title="Donation">
                    <li className="hover:underline cursor-pointer">Bitcoin</li>
                    <li className="hover:underline cursor-pointer">Ethereum</li>
                </ListComponent>         
            </div>
            <p className='text-sm font-medium sm:font-semibold text-center md:text-left text-medium-grey pt-8 md:pt-16 pb-4'>© 2023 Coinnify. All rights reserved</p>
        </footer>
    )
}

function ListComponent({title, children}){
    const handleClick = (e) => {
        e.currentTarget.nextElementSibling.classList.replace('hidden', 'flex')
    }
    return (
        <div className="text-sm border-t last:border-b border-faded-grey md:border-y-0  w-full md:w-fit">
            <h4 onClick={handleClick} className='cursor-default flex justify-between py-4 md:py-0 text-base font-semibold md:mb-6'>
                {title}
                <button className='md:hidden'>
                    <FaAngleDown />
                </button>
            </h4>
            <ul className='hidden md:flex flex-col gap-4 pl-4 md:pl-0 font-medium mb-4 md:mb-0'>
                {children}
            </ul>
        </div>
    )
}

export default Footer
