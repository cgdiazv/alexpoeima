import { NextResponse } from "next/server";
import { pradoAdmin, pradoClient } from "@/lib/prado";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "";
    const state = searchParams.get("state") || "";

    const storeId = process.env.NEXT_PUBLIC_PRADO_STORE_ID;
    let shippingMethods: any[] = [];

    if (storeId) {
      try {
        // Fetch store details from Prado Commerce which includes configured shippingZones
        const storeData = await pradoAdmin(`/api/stores/${storeId}`);
        if (storeData && Array.isArray(storeData.shippingZones) && storeData.shippingZones.length > 0) {
          shippingMethods = storeData.shippingZones.map((zone: any, idx: number) => {
            const rawVal = String(zone.rateValue || "0");
            const numericPrice = parseFloat(rawVal.replace(/[^0-9.]/g, "")) || 0;
            return {
              id: zone.id || `zone-${idx}`,
              name: zone.name,
              price: numericPrice,
              description: zone.regions ? `Applies to: ${zone.regions}` : undefined,
              rateType: zone.rateType,
              rateValue: zone.rateValue,
            };
          });
        }
      } catch (err: any) {
        console.error("Error fetching merchant store shipping zones from Prado:", err.message);
      }
    }

    // Fallback if no shipping zones configured in Prado store settings
    if (shippingMethods.length === 0) {
      shippingMethods = [
        {
          id: "standard",
          name: "Standard Shipping",
          price: 5.00,
          description: "Standard Ground Delivery",
        },
      ];
    }

    return NextResponse.json({ methods: shippingMethods });
  } catch (error) {
    console.error("Error in shipping methods API:", error);
    return NextResponse.json(
      { message: "Failed to load shipping methods" },
      { status: 500 }
    );
  }
}
