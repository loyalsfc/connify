'use client'

import { createContext, useEffect, useRef, useState } from "react"

const PortfolioContext = createContext(null)

const PortfolioContextProvider = ({children}) => {
    const [portfolio, setPortfolio] = useState({portfolio: [], assets: []})
    const [portfolioId, setPortfolioId] = useState(null)

    useEffect(()=>{
        if(!portfolio) return;
        setPortfolioId(portfolio.portfolio.find(portfolio => portfolio.is_default === true)?.id)
    },[portfolio])

    const updatePortfolio = (newItem) => {
        setPortfolio(prevItem => {
            return {...prevItem, assets: [...prevItem.assets, newItem]}
        })
    }

    const deletePortfolio = (id) => {
        setPortfolio(prevItem => {
            return {...prevItem, assets: prevItem.assets.filter(item => item.id !== id)}
        })
    }

    return(
        <PortfolioContext.Provider value={{portfolio, setPortfolio, portfolioId, updatePortfolio, deletePortfolio}}>
            {children}
        </PortfolioContext.Provider>
    )
}

export {PortfolioContextProvider, PortfolioContext}