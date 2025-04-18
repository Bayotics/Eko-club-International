import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, amount, fullName, reference, phone = "" } = body;

    // For Flutterwave, we don't need to convert the amount
    const response = await fetch("https://api.flutterwave.com/v3/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tx_ref: reference,
        amount: parseFloat(amount),
        currency: "NGN",
        redirect_url: `${request.headers.get("origin")}/donate/thank-you`,
        customer: {
          email,
          name: fullName,
          phonenumber: phone,
        },
        customizations: {
          title: "Eko Club International Donation",
          description: "Donation to support Eko Club International initiatives",
          logo: `${request.headers.get("origin")}/logo.png`,
        },
      }),
    });

    const data = await response.json();

    if (!data.status || data.status !== "success") {
      throw new Error(data.message || "Failed to initialize Flutterwave payment");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Flutterwave payment initialization error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
