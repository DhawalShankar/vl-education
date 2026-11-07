import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import RazorpayCheckout from "./RazorpayCheckout";
import { enrollmentAPI, learnAPI, paymentsAPI } from "@/app/lib/api";

vi.mock("@/app/lib/api", () => ({
  enrollmentAPI: { enroll: vi.fn() },
  learnAPI: { enroll: vi.fn() },
  paymentsAPI: {
    createOrder: vi.fn(),
    verifyPayment: vi.fn(),
  },
}));

const createOrder = vi.mocked(paymentsAPI.createOrder);
const verifyPayment = vi.mocked(paymentsAPI.verifyPayment);
const enroll = vi.mocked(enrollmentAPI.enroll);
const freeEnroll = vi.mocked(learnAPI.enroll);

let paymentFailed: ((event: { error?: { description?: string } }) => void) | undefined;
let dismiss: (() => void) | undefined;
let handler: ((response: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => Promise<void>) | undefined;

beforeEach(() => {
  vi.clearAllMocks();
  paymentFailed = undefined;
  dismiss = undefined;
  handler = undefined;
  createOrder.mockResolvedValue({
    order_id: "order_test",
    amount: 10000,
    currency: "INR",
    key_id: "rzp_test",
  });
  verifyPayment.mockResolvedValue({ success: true });
  enroll.mockResolvedValue({
    id: "enrollment-1",
    course_id: "course-1",
    course_title: "Test course",
    course_language: "English",
    course_level: "beginner",
    status: "active",
    progress_percentage: 0,
    total_lessons: 1,
    completed_lessons: 0,
    enrolled_at: "2026-01-01",
  });
  freeEnroll.mockResolvedValue({
    id: "",
    course_id: "",
    course_title: "",
    course_language: "",
    course_level: "",
    status: "",
    progress_percentage: 0,
    total_lessons: 0,
    completed_lessons: 0,
    enrolled_at: ""
  });
  window.Razorpay = class {
    constructor(options: {
      handler: typeof handler;
      modal: { ondismiss: () => void };
    }) {
      handler = options.handler;
      dismiss = options.modal.ondismiss;
    }

    on(_event: "payment.failed", callback: typeof paymentFailed) {
      paymentFailed = callback;
    }

    open() {}
  };
});

afterEach(() => cleanup());

describe("RazorpayCheckout", () => {
  it("creates an order, verifies the exact callback, and enrolls after verification", async () => {
    const onSuccess = vi.fn();
    render(<RazorpayCheckout courseId="course-1" onSuccess={onSuccess} onError={vi.fn()} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /pay and enroll/i })));
    await waitFor(() => expect(handler).toBeTypeOf("function"));

    const response = {
      razorpay_order_id: "order_test",
      razorpay_payment_id: "pay_test",
      razorpay_signature: "signature_test",
    };
    await act(async () => handler?.(response));

    expect(createOrder).toHaveBeenCalledWith("course-1");
    expect(verifyPayment).toHaveBeenCalledWith(response);
    expect(enroll).toHaveBeenCalledWith("course-1");
    expect(onSuccess).toHaveBeenCalledOnce();
  });

  it("reports failed payments and modal dismissal", async () => {
    const onError = vi.fn();
    render(<RazorpayCheckout courseId="course-1" onSuccess={vi.fn()} onError={onError} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /pay and enroll/i })));
    await waitFor(() => expect(paymentFailed).toBeTypeOf("function"));

    act(() => paymentFailed?.({ error: { description: "Card declined" } }));
    expect(onError).toHaveBeenCalledWith("Card declined");
    act(() => dismiss?.());
    expect(onError).toHaveBeenCalledWith("Payment was cancelled.");
  });

  it("does not enroll when signature verification fails", async () => {
    const onError = vi.fn();
    verifyPayment.mockRejectedValueOnce(new Error("Invalid signature"));
    render(<RazorpayCheckout courseId="course-1" onSuccess={vi.fn()} onError={onError} />);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /pay and enroll/i })));
    await waitFor(() => expect(handler).toBeTypeOf("function"));

    await act(async () =>
      handler?.({
        razorpay_order_id: "order_test",
        razorpay_payment_id: "pay_test",
        razorpay_signature: "bad",
      })
    );

    expect(enroll).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith("Invalid signature");
  });

  it("prevents duplicate clicks while processing", async () => {
    const pending = new Promise<never>(() => {});
    createOrder.mockReturnValueOnce(pending);
    render(<RazorpayCheckout courseId="course-1" onSuccess={vi.fn()} onError={vi.fn()} />);
    const button = screen.getByRole("button", { name: /pay and enroll/i });
    await act(async () => {
      fireEvent.click(button);
      fireEvent.click(button);
    });
    expect(createOrder).toHaveBeenCalledOnce();
  });

  it("keeps free-course enrollment on the existing enrollment API", async () => {
    await freeEnroll("free-course");
    expect(freeEnroll).toHaveBeenCalledWith("free-course");
    expect(paymentsAPI.createOrder).not.toHaveBeenCalled();
  });
});
