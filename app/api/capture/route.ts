import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Capture payment & sync to Prado Commerce
  // const capture = await paypalClient.captureOrder(...);
  // await pradoClient.syncOrder(...);
  
  return NextResponse.json({ message: "Payment captured" });
}
