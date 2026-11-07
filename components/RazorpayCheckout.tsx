"use client";

import { useRef, useState } from "react";
import { enrollmentAPI, paymentsAPI, PaymentVerificationRequest } from "@/app/lib/api";

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayPaymentResponse = PaymentVerificationRequest;

interface RazorpayPaymentFailedEvent {
  error?: {
    description?: string;
  };
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: "payment.failed", handler: (event: RazorpayPaymentFailedEvent) => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpay(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Checkout is only available in a browser"));
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load Razorpay checkout")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load Razorpay checkout"));
    document.body.appendChild(script);
  }).catch((error) => {
    razorpayScriptPromise = null;
    throw error;
  });

  return razorpayScriptPromise;
}

interface RazorpayCheckoutProps {
  courseId: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export default function RazorpayCheckout({ courseId, onSuccess, onError }: RazorpayCheckoutProps) {
  const [processing, setProcessing] = useState(false);
  const processingRef = useRef(false);

  const resetWithError = (message: string) => {
    processingRef.current = false;
    setProcessing(false);
    onError(message);
  };

  const handlePayment = async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    onError("");

    try {
      const order = await paymentsAPI.createOrder(courseId);
      await loadRazorpay();
      if (!window.Razorpay) throw new Error("Razorpay checkout is unavailable");

      const razorpay = new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        handler: async (response) => {
          try {
            const verification = await paymentsAPI.verifyPayment(response);
            if (verification.success === false) throw new Error(verification.message || "Payment verification failed");
            await enrollmentAPI.enroll(courseId);
            processingRef.current = false;
            setProcessing(false);
            onSuccess();
          } catch (error) {
            resetWithError(error instanceof Error ? error.message : "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => resetWithError("Payment was cancelled."),
        },
      });

      razorpay.on("payment.failed", (event) => {
        resetWithError(event.error?.description || "Payment failed. Please try again.");
      });
      razorpay.open();
    } catch (error) {
      resetWithError(error instanceof Error ? error.message : "Could not start payment");
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={processing}
      className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white disabled:opacity-50"
    >
      {processing ? "Processing payment…" : "Pay and enroll"}
    </button>
  );
}
