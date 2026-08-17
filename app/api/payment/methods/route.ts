import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";

export async function GET() {
  try {
    const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;
    const paymentMethods: any[] = [];

    if (storeId) {
      try {
        const storeData = await pradoAdmin(`/api/stores/${storeId}`);
        if (storeData) {
          // Credit Card (Stripe / Authorize.net)
          if (storeData.stripeChargesEnabled || storeData.authNetConfigured || storeData.authNetLoginId) {
            paymentMethods.push({
              id: "CREDIT_CARD",
              name: "Credit / Debit Card",
              description: "Pay securely with Credit Card",
              type: "card",
            });
          }

          // Offline / Manual Payments (Cash on Delivery / Bank Transfer)
          if (storeData.offlinePaymentsEnabled) {
            paymentMethods.push({
              id: "OFFLINE_PAYMENT",
              name: "Cash on Delivery / Manual Payment",
              description: "Pay upon delivery or bank transfer",
              type: "offline",
            });
          }
        }
      } catch (err: any) {
        console.error("Error fetching merchant store payment config from Prado:", err.message);
      }
    }

    // Default fallback if no specific flags are set yet
    if (paymentMethods.length === 0) {
      paymentMethods.push(
        {
          id: "CREDIT_CARD",
          name: "Credit / Debit Card",
          description: "Pay securely with Credit Card",
          type: "card",
        },
        {
          id: "OFFLINE_PAYMENT",
          name: "Cash on Delivery / Manual Payment",
          description: "Pay upon delivery or bank transfer",
          type: "offline",
        }
      );
    }

    return NextResponse.json({ methods: paymentMethods });
  } catch (error) {
    console.error("Error in payment methods API:", error);
    return NextResponse.json(
      { message: "Failed to load payment methods" },
      { status: 500 }
    );
  }
}
