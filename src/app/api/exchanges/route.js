export async function GET(request) {
    const res = await fetch(`https://pro-api.coinmarketcap.com/v1/exchange/map?sort=volume_24h`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const data = await res.json()
   
    return Response.json(data)
}