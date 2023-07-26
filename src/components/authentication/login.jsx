'use client'

import React, { useContext } from 'react'
import LoginComponent from './loginComponent'
import { supabase } from '@/lib/supabaseClient'
import { Context } from '../../context/context'

function Login() {
    const {showNotification, setUser, showAuthModal, setShowAuthModal} = useContext(Context)

    const login = async (info) => {
        const { data, error } = await supabase.auth.signInWithPassword(info)
        if(data.session){
            setUser(data.user);
            showNotification('User Signed in', '#22655E');
            setShowAuthModal({...showAuthModal, isShown: false});
            return;
        }
        let errorText = error.toString();        

        if(errorText.includes('Email not confirmed')){
            showNotification('Email not confirmed', '#EF4444');
        } else if(errorText.includes('Invalid login credentials')){
            showNotification('Invalid login credentials', '#EF4444');
        } else {
            showNotification('An error occured', '#EF4444');
        }
    }
    return (
        <div>
            <LoginComponent isLogin={true} auth={login}/>       
        </div>
    )
}

function Register() {
    const {showNotification} = useContext(Context)

    
    const signUp = async(info) =>{
        const { data } = await supabase.auth.signUp(info);
        if(data?.user?.identities.length > 0){
            await supabase
                .from('portfolio')
                .insert({name: "My Portfolio", user_id: data?.user?.id, is_default: true})
            showNotification('Check Email for Confirmation', '#22655E');
        } else if(data?.user?.identities.length === 0){
            showNotification('User already exist', '#EF4444');
        } else {
            showNotification('An error occured', '#EF4444');
        }
    }

    return (
        <div>
            <LoginComponent isLogin={false} auth={signUp}/>
        </div>
    )
}

export {Login, Register}