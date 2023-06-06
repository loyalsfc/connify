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
                    <li>About Us</li>
                    <li>Careers Join Us</li>
                    <li>Company Blog</li>
                    <li>Branding Guide</li>
                    <li>Disclaimer</li>
                    <li>Terms of Service</li>
                    <li>Privacy Policy</li>
                    <li>Ad Policy</li>
                </ListComponent>
                <ListComponent title="Community">
                    <li>Twitter</li>
                    <li>Telegram Chat</li>
                    <li>Telegram News</li>
                    <li>Instagram</li>
                    <li>Reddit</li>
                    <li>Discord</li>
                    <li>Facebook</li>
                    <li>Youtube</li>
                    <li>TikTok</li>
                </ListComponent>        
                <ListComponent title="Support">
                    <li>Request Form</li>
                    <li>Advertising</li>
                    <li>Candy Rewards Listing</li>
                    <li>Help Center</li>
                    <li>Bug Bounty</li>
                    <li>FAQ</li>
                </ListComponent>   
                <ListComponent title="Donation">
                    <li>Bitcoin</li>
                    <li>Ethereum</li>
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
