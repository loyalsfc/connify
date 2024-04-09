export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const res = await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?slug=${slug}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
    })
    const data = await res.json()
   
    return Response.json({ data: data?.data })
  }