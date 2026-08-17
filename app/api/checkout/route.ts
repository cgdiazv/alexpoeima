import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Initiate PayPal order
  // const order = await paypalClient.createOrder(...);
  
  return NextResponse.json({ message: "Checkout initiated" });
}
