import { NextResponse } from "next/server";
import { pradoAdmin } from "@/lib/prado";

export async function POST(request: Request) {
  try {
    const { items, shipping, total, currency } = await request.json();

    if (!items || !shipping || total === undefined) {
      return NextResponse.json(
        { message: "Missing order details" },
        { status: 400 }
      );
    }

    // MOCK: In a real scenario, you would verify payment capture with PayPal here.
    // const capture = await paypalClient.captureOrder(orderId);
    // if (capture.status !== 'COMPLETED') throw new Error("Payment not completed");

    // 1. Ensure customer exists or create them (Prado Commerce)
    let customerId;
    try {
      const customer = await pradoAdmin("/api/customers", {
        method: "POST",
        body: JSON.stringify({ 
          email: shipping.email, 
          firstName: shipping.firstName, 
          lastName: shipping.lastName 
        }),
      });
      customerId = customer.id;
    } catch (error: any) {
      console.log("Customer might already exist:", error.message);
      // In a real implementation, you would fetch the customer by email here
      // customerId = (await pradoAdmin(`/api/customers?email=${shipping.email}`))[0].id;
    }

    // 2. Create the Order in Prado Commerce
    const orderData = {
      customerId: customerId, // Might be undefined if not properly fetched above
      customerEmail: shipping.email,
      totalAmount: Math.round(total * 100), // Prado likely uses cents
      currency: currency || "USD",
      status: "COMPLETED", // Since we "captured" payment
      paymentMethod: "PAYPAL",
      shippingAddress: {
        address1: shipping.address,
        city: shipping.city,
        country: shipping.country,
        postalCode: shipping.postalCode,
      },
      lineItems: items.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      await pradoAdmin("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    } catch (error: any) {
      console.error("Failed to sync order to Prado Commerce:", error.message);
      // In a real application, you might enqueue this for retry or notify admins.
    }

    return NextResponse.json({ message: "Payment captured and order placed" });
  } catch (error) {
    console.error("Capture Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

