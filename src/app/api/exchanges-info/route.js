const baseUrl = "https://pro-api.coinmarketcap.com/v1/exchange/"

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    
    const res = await fetch(`${baseUrl}info?slug=${slug}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const exchangeMetadata = await res.json();
    
    const exchangeId = exchangeMetadata?.data[slug]?.id;
    const assetRes = await fetch(`${baseUrl}assets?id=${exchangeId}`, {
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
    const exchangeAssets = await assetRes.json();

   
    return Response.json({exchangeMetadata, exchangeAssets});
}