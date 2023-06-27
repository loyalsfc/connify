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
    if(!num) return 0;
    let twoDecimal = Math.floor(num * 100) / 100
    if(twoDecimal == 0.00){
        return num?.toFixed(7)
    }
    return numberToString(Math.floor(num * 100) / 100)
}

// export const fetcher = (url) => axios.get(`http://192.168.0.192:5000/api/${url}`)

export const fetcher = (url) => axios.post(`http://192.168.0.192:5000/api`, {url})

export const coinFetcher = (slug) => axios.post(`http://192.168.0.192:5000/api/coin`, {slug})

export function getImage(id){
    return `https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`
}

export function getExchangeImage(id){
    return `https://s2.coinmarketcap.com/static/img/exchanges/64x64/${id}.png`
}

export function getPrice(id, data){
    return data?.data?.data[id]?.quote.USD.price
}

export function formatPrice(price){
    if(!price){
        return 0
    }
    if(price < 1){
        if(price < -0.001){
            return price.toFixed(2);
        } else if( price < -0.0000001){
            return price.toFixed(6)
        } else {
            return price.toFixed(8)
        }
    }
    if(price > 999){
        return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if(price > 1){
        return price.toFixed(2)
    } else if (price > 0.001){
        return price.toFixed(6)
    } else {
        return price.toFixed(8)
    }
}

export function getDurationChange(id, duration, data){
    return data?.data?.data[id]?.quote.USD[`percent_change_${duration}`]
}

export function calculateProfitLoss(currentPrice, averagePrice){
    return currentPrice - averagePrice
}

export function getProfitPercentage(currentPrice, averagePrice){
    const priceDiff = currentPrice - averagePrice
    const percent = (priceDiff / averagePrice ) * 100
    return percent.toFixed(2)
}