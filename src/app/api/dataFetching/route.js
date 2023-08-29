import { NextResponse } from 'next/server'
 
export async function POST(request) {
    const {url} = await request.json();
    const res = await fetch(`https://pro-api.coinmarketcap.com/${url}`, {
        headers: {
        'Content-Type': 'application/json',
        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        },
    })
 
  const data = await res.json()
 
  return NextResponse.json(data)
}