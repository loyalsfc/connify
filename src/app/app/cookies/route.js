import { cookies } from "next/headers"
import  { NextResponse } from "next/server"

export async function POST(request){
    const res = await request.json()
    console.log(res)
    cookies().set('limit', res)
    return NextResponse.json({res})
}