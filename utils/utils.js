import axios from "axios"
export const baseUrl = "https://pro-api.coinmarketcap.com/"

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

export const makeRequest = async (url, cache) => {
    console.log(process.env.NEXT_PUBLIC_URL + url);
    const res = await fetch(process.env.NEXT_PUBLIC_URL + url, {
        headers: {
            "content-type": "application/json",
        },
        cache,
    })

    return res.json();
}

export const makeRequestWithRevalidate = async (url, revalidation) => {
    console.log(url);
    console.log(process.env.NEXT_PUBLIC_URL + url);
    const res = await fetch(process.env.NEXT_PUBLIC_URL + url, {
        headers: {
            "content-type": "application/json",
            'X-CMC_PRO_API_KEY': process.env.NEXT_PUBLIC_CMC_API_KEY
        },
        revalidation,
    })
    return res.json();
}

export const fetcher = (url) => axios.post("/api/dataFetching", {url})

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

export function soldCoinProfit(transaction, average_fee){
    // if(!transaction) return 0;
    let profit = 0;
    transaction.forEach(item => {
        if(item.transaction_type === "sell"){
            let cost = item.quantity * average_fee;
            profit += (item.total_spent - cost)
        }
    })
    return profit;
}

export function calculateAssetProfits(transaction, average_fee, getPrice){
    const purchasedAssets = transaction.reduce((acc, item) => {
        if (item.transaction_type === 'buy') {
            return acc + item.quantity;
        } else if (item.transaction_type === 'sell'){
            return acc - item.quantity
        }
        return acc;
      }, 0);
    const currentAssetCost = purchasedAssets * average_fee;
    const currentAssetPrice = purchasedAssets * getPrice
    let profit = currentAssetPrice - currentAssetCost;
    return profit;
}

export function calculateTransferInProfit(transaction, getPrice){
    const transferIn = transaction.reduce((acc, item) => {
        if (item.transfer_type === 'in') {
            return acc + item.quantity;
        }
        return acc;
      }, 0);
      return transferIn * getPrice;
}

export function calculateTransferOutCost(transaction, getPrice){
    const transferOut = transaction.reduce((acc, item) => {
        if (item.transfer_type === 'out') {
            return acc + item.quantity;
        }
        return acc;
    }, 0);
    return transferOut * getPrice;
}

export function totalProfitPercentage(transaction, average_fee, getPrice){
    const profit = totalProfit(transaction, average_fee, getPrice);
    const percentage = (profit / totalCost(transaction)) * 100;
    if(isNaN(percentage)) return 0;
    return percentage.toFixed(2);
}

export function profit(transaction, average_fee, getPrice){
    let profit = totalProfit(transaction, average_fee, getPrice)
    if(profit > 0){
        return formatPrice(profit);
    } else {
        if(profit < -1){
            return profit.toFixed(2);
        } else {
            return profit.toFixed(8);
        }
    }
}

export function totalProfit(transaction, average_fee, getPrice){
    return (soldCoinProfit(transaction, average_fee) + calculateAssetProfits(transaction, average_fee, getPrice) + calculateTransferInProfit(transaction, getPrice)) - calculateTransferOutCost(transaction, getPrice)
}

export function totalCost(transaction){
    let cost = 0
    transaction.forEach(item => {
        if(item.transaction_type === "buy"){
            return cost += item.total_spent
        }
    })
    return cost;
}

export function formatDate(date){
    const dateObj = new Date(date)
    const formattedDate = dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
    return formattedDate;
}