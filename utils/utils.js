import axios from "axios"

export function numberToString(num){
    if(!num) return;
    return num.toLocaleString("en-US")
}

export function getCoinVolume(volumeInUsd, coinPrice){
    const coinVolume = Math.floor(volumeInUsd / coinPrice)
    return numberToString(coinVolume)
}

export function toTwoDecimalPlace(num){
    return numberToString(Math.floor(num * 100) / 100)
}

// export const fetcher = (url) => axios.get(`http://192.168.0.192:5000/api/${url}`)

export const fetcher = (url) => axios.post(`http://192.168.0.192:5000/api`, {url})

export const coinFetcher = (slug) => axios.post(`http://192.168.0.192:5000/api/coin`, {slug})