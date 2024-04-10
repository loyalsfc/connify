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
                <ListComponent 
                    title="About"
                    contents={[
                        "About Us",
                        "Careers Join Us",
                        "Company Blog",
                        "Branding Guide",
                        "Disclaimer",
                        "Terms of Service",
                        "Privacy Policy",
                        "Ad Policy",
                    ]}
                />
                <ListComponent 
                    title="Community"
                    contents={[
                        "Twitter",
                        "Telegram Chat",
                        "Telegram News",
                        "Instagram",
                        "Reddit",
                        "Discord",
                        "Facebook",
                        "Youtube",
                        "TikTok",
                    ]}
                />        
                <ListComponent 
                    title="Support"
                    contents={[
                        "Request Form",
                        "Advertising",
                        "Candy Rewards Listing",
                        "Help Center",
                        "Bug Bounty",
                        "FAQ",
                    ]}
                />   
                <ListComponent 
                    title="Donation" 
                    contents={["Bitcoin", "Ethereum"]} 
                />
            </div>
            <p className='text-sm font-medium sm:font-semibold text-center md:text-left text-medium-grey pt-8 md:pt-16 pb-4'>© 2023 Coinnify. All rights reserved</p>
        </footer>
    )
}

function ListComponent({title, contents}){
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
                {contents?.map((item, index) => {
                    return <li className="hover:underline cursor-pointer hover:text-green-400" key={index}>{item}</li>
                })}
            </ul>
        </div>
    )
}

export default Footer
