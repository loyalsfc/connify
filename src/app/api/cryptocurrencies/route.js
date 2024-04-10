export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const start = searchParams.get('start')
    const limit = searchParams.get("limit")
    const res = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=${start}&limit=${limit}&convert=USD`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const data = await res.json()
   
    return Response.json(data)
}