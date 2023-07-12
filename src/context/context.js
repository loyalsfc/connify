'use client'
import { supabase } from "@/lib/supabaseClient"
import { createContext, useEffect, useRef, useState } from "react"
import useSWR from 'swr'
import { fetcher } from "../../utils/utils"

const Context = createContext(null)

const ContextProvider = ({children}) => {
    const [showAuthModal, setShowAuthModal] = useState({isShown: false, type: 'login'})
    const notificationRef = useRef(null)
    const [user, setUser]  = useState(null)  
    const [authLoading, setAuthLoading] = useState(true)
    const [favorites, setFavorites] = useState(typeof window !== "undefined" ? JSON.parse(localStorage.getItem('favorites')) : [])
    const {data: coins} = useSWR(
        'v1/cryptocurrency/map?sort=cmc_rank',
        fetcher
    )
    console.log(favorites);

    useEffect(()=>{
        if(typeof window !== "undefined"){
            localStorage.setItem('favorites', JSON.stringify(favorites))
        }
    },[favorites])
    
    const showNotification = (text, color) => {
        const wrapper = document.createElement('div')
        wrapper.classList.add('notification');
        wrapper.style.backgroundColor = color;
        wrapper.textContent = text;
        notificationRef.current.append(wrapper);

        setTimeout(()=>{
            wrapper.remove();
        }, 5000)
    }

    useEffect(()=>{
        fetchSession();

        supabase.auth.onAuthStateChange((event, session) => {
            if (event == 'SIGNED_IN') {
                setUser(session.user)
            } else if (event == "SIGNED_OUT"){
                setUser(null)
            }   
        })
    },[])

    const fetchSession = async() => {
        const { data: {session}, error } = await supabase.auth.getSession()
        session?.user && setUser(session?.user)
        setAuthLoading(false)
    }

    const addToFavorites = (id) => {
        if(favorites.some(item => item == id)){
            setFavorites(prevItems => {
                return prevItems.filter(item => item != id)
            })
        } else {
            setFavorites([...favorites, id])
        }
    }

    return(
        <Context.Provider value={{showAuthModal, setShowAuthModal, notificationRef, showNotification, user, setUser, authLoading, coins, favorites, addToFavorites, setFavorites}}>
            {children}
        </Context.Provider>
    )
}

export {ContextProvider, Context}