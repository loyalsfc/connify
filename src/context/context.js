'use client'
import { supabase } from "@/lib/supabaseClient"
import { createContext, useEffect, useRef, useState } from "react"

const Context = createContext(null)

const ContextProvider = ({children}) => {
    const [showAuthModal, setShowAuthModal] = useState({isShown: false, type: 'login'})
    const notificationRef = useRef(null)
    const [user, setUser]  = useState(null)  
    const [authLoading, setAuthLoading] = useState(true)
    
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
            }
        })
        
    },[])

    const fetchSession = async() => {
        const { data: {session}, error } = await supabase.auth.getSession()
        session?.user && setUser(session?.user)
        setAuthLoading(false)
    }

    return(
        <Context.Provider value={{showAuthModal, setShowAuthModal, notificationRef, showNotification, user, setUser, authLoading}}>
            {children}
        </Context.Provider>
    )
}

export {ContextProvider, Context}