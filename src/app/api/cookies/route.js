import { cookies } from "next/headers"
import  { NextResponse } from "next/server"

export async function POST(request){
    const res = await request.json()
    cookies().set('limit', res.value)
    return NextResponse.json({res})
}