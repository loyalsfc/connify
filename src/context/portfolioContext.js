'use client'

import { supabase } from "@/lib/supabaseClient"
import { createContext, useEffect, useRef, useState } from "react"

const PortfolioContext = createContext(null)

const PortfolioContextProvider = ({children}) => {
    const [portfolio, setPortfolio] = useState(null)
    const [portfolioId, setPortfolioId] = useState(null)
    console.log(portfolio)

    useEffect(()=>{
        if(!portfolio) return;
        setPortfolioId(portfolio.portfolio.find(portfolio => portfolio.is_default === true).id)
    },[portfolio])

    return(
        <PortfolioContext.Provider value={{portfolio, setPortfolio, portfolioId}}>
            {children}
        </PortfolioContext.Provider>
    )
}

export {PortfolioContextProvider, PortfolioContext}