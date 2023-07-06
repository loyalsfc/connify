import React from 'react'

function NewsLetter() {
    return (
        <section className='bg-news-grey px-4 md:px-8 py-6 md:py-12 mb-12'>
            <article className='md:text-center md:border border-dark-grey p'>
                <div className='md:w-3/5 mx-auto'>
                    <h1 className='pt-4 sm:pt-16 pb-2 text-sm sm:text-3xl font-semibold'>Be the first to know about every crypto news every day</h1>
                    <p className='mb-8 text-sm md:text-base'>Get crypto analysis, news and updates right to your inbox! Sign up here so you don&apos;t miss a single newsletter.</p>
                    <div className='flex flex-col md:flex-row items-center gap-4 mb-4 sm:mb-16'>
                        <input type='email' placeholder='Enter your email' className='bg-transparent w-full flex-1 border border-dark-grey py-3 px-6 text-sm' />
                        <button className='text-sm font-semibold text-white w-full md:w-fit bg-green-600 rounded-md py-3 px-6'>Subscribe now</button>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default NewsLetter