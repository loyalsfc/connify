const baseUrl = "https://pro-api.coinmarketcap.com/v2/cryptocurrency/"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    const res = await fetch(`${baseUrl}quotes/latest?slug=${slug}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const coinData = await res.json();
    
    
    const assetRes = await fetch(`${baseUrl}info?slug=${slug}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const metaData = await assetRes.json();

   
    return Response.json({coinData, metaData});
}