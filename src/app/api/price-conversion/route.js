export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const amount = searchParams.get('amount');
    const id = searchParams.get('id');
    const convert = searchParams.get('convert');
    const res = await fetch(`https://pro-api.coinmarketcap.com/v2/tools/price-conversion?amount=${amount}&id=${id}&convert=${convert}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
      },
    })
    const data = await res.json()

    return Response.json({ data: data.data })
  }