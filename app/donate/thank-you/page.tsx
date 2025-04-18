"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Check for Paystack parameters
        const reference = searchParams.get("reference");
        // Check for Flutterwave parameters
        const transactionId = searchParams.get("transaction_id");
        const status = searchParams.get("status");

        if (reference) {
          // Verify Paystack payment
          const response = await fetch(
            `/api/payments/verify/paystack?reference=${reference}`
          );
          const data = await response.json();

          if (data.status && data.data.status === "success") {
            setVerificationStatus("success");
            setPaymentDetails({
              amount: (data.data.amount / 100).toFixed(2),
              currency: data.data.currency,
              reference: data.data.reference,
              date: new Date(data.data.paid_at).toLocaleDateString(),
              gateway: "Paystack",
            });
          } else {
            setVerificationStatus("error");
          }
        } else if (transactionId && status === "successful") {
          // Verify Flutterwave payment
          const response = await fetch(
            `/api/payments/verify/flutterwave?transaction_id=${transactionId}`
          );
          const data = await response.json();

          if (data.status === "success" && data.data.status === "successful") {
            setVerificationStatus("success");
            setPaymentDetails({
              amount: data.data.amount.toFixed(2),
              currency: data.data.currency,
              reference: data.data.tx_ref,
              date: new Date(data.data.created_at).toLocaleDateString(),
              gateway: "Flutterwave",
            });
          } else {
            setVerificationStatus("error");
          }
        } else {
          // No valid parameters found
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus("error");
      }
    }

    verifyPayment();
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 pb-8 text-center">
            {verificationStatus === "loading" && (
              <div className="flex flex-col items-center py-8">
                <div className="w-16 h-16 border-4 border-[#C8A97E] border-t-transparent rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-bold mb-2">Verifying your donation...</h2>
                <p className="text-gray-600">Please wait while we confirm your payment.</p>
              </div>
            )}

            {verificationStatus === "success" && (
              <div className="flex flex-col items-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h2>
                <p className="text-gray-600 mb-6">
                  Your generous contribution will help us make a difference.
                </p>

                {paymentDetails && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-xs">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p className="text-gray-500 text-left">Amount:</p>
                      <p className="font-medium text-right">
                        {paymentDetails.currency} {paymentDetails.amount}
                      </p>
                      <p className="text-gray-500 text-left">Reference:</p>
                      <p className="font-medium text-right">{paymentDetails.reference}</p>
                      <p className="text-gray-500 text-left">Date:</p>
                      <p className="font-medium text-right">{paymentDetails.date}</p>
                      <p className="text-gray-500 text-left">Payment Method:</p>
                      <p className="font-medium text-right">{paymentDetails.gateway}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/">Return Home</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/donate">Donate Again</Link>
                  </Button>
                </div>
              </div>
            )}

            {verificationStatus === "error" && (
              <div className="flex flex-col items-center py-8">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't verify your payment. If you believe this is an error, please
                  contact our support team.
                </p>
                <div className="flex gap-4">
                  <Button asChild>
                    <Link href="/">Return Home</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/donate">Try Again</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
