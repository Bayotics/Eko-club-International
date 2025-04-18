import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, currency, fullName, reference } = body;

    // Convert amount to kobo/cents (smallest currency unit)
    const amountInSmallestUnit = Math.round(parseFloat(amount) * 100);

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInSmallestUnit,
        currency: currency === "NGN" ? "NGN" : "USD",
        reference,
        metadata: {
          full_name: fullName,
          custom_fields: [
            {
              display_name: "Donor Name",
              variable_name: "donor_name",
              value: fullName,
            },
          ],
        },
        callback_url: `${request.headers.get("origin")}/donate/thank-you`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize Paystack payment");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Paystack payment initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
