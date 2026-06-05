"use client";

import { FormEvent, useRef, useState } from "react";

type CartItem = {
  id?: string;
  slug?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

type SubmitStatus = "idle" | "submitting" | "success" | "error";

function readCartItemsFromLocalStorage(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const possibleKeys = [
    "cart",
    "cross-border-cart",
    "cross-border-store-cart",
  ];

  for (const key of possibleKeys) {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      continue;
    }

    try {
      const parsedValue = JSON.parse(rawValue);

      if (Array.isArray(parsedValue)) {
        return parsedValue;
      }

      if (Array.isArray(parsedValue.items)) {
        return parsedValue.items;
      }
    } catch {
      continue;
    }
  }

  return [];
}

function calculateCartTotal(cartItems: CartItem[]) {
  return cartItems.reduce((total, item) => {
    const price = typeof item.price === "number" ? item.price : 0;
    const quantity = typeof item.quantity === "number" ? item.quantity : 1;

    return total + price * quantity;
  }, 0);
}

export default function ContactPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const isSubmittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const cartItems = readCartItemsFromLocalStorage();
    const cartTotal = calculateCartTotal(cartItems);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      companyName: String(formData.get("companyName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      whatsapp: String(formData.get("whatsapp") || "").trim(),
      interestedProduct: String(formData.get("interestedProduct") || "").trim(),
      country: String(formData.get("country") || "").trim(),
      quantity: String(formData.get("quantity") || "").trim(),
      requirements: String(formData.get("requirements") || "").trim(),
      message: String(formData.get("message") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      sourcePage: window.location.pathname,
      cartItems,
      cartTotal,
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to submit inquiry.");
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error("Inquiry form submit error:", error);
      setStatus("error");
      setErrorMessage(
        "We could not send your order request. Please try again or contact us by email."
      );
      isSubmittingRef.current = false;
    }
  }

  return (
    <main className="bg-stone-50 px-6 pb-16 text-stone-950">
      <section className="mx-auto max-w-5xl">
        <section className="grid gap-10 py-16 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Request Order
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Submit Order Request
            </h1>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              Ask about product availability, shipping, final cost, and payment
              arrangement before checkout is ready.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Before you submit</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                This is a request, not a paid order. We will confirm
                availability, final cost, shipping, and payment details by
                email.
              </p>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                No payment is required before confirmation. After submitting,
                you receive an email confirmation and can decide whether to
                continue.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5">
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Name</span>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Company Name (optional)
                </span>
                <input
                  name="companyName"
                  type="text"
                  placeholder="Company or organization if applicable"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    Phone (optional)
                  </span>
                  <input
                    name="phone"
                    type="text"
                    placeholder="+1 555 000 0000"
                    className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    WhatsApp (optional)
                  </span>
                  <input
                    name="whatsapp"
                    type="text"
                    placeholder="+1 555 000 0000"
                    className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                  />
                </label>
              </div>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Country
                </span>
                <input
                  name="country"
                  type="text"
                  required
                  placeholder="United States, Canada, Germany..."
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Interested Products
                </span>
                <input
                  name="interestedProduct"
                  type="text"
                  placeholder="Product name, product category, or cart items"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Expected Quantity (optional)
                </span>
                <input
                  name="quantity"
                  type="text"
                  placeholder="Example: 1 piece, 3 pieces, 20 pieces"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">
                  Order Questions (optional)
                </span>
                <textarea
                  name="requirements"
                  placeholder="Ask about shipping, packaging, availability, color, size, or delivery time."
                  rows={4}
                  className="resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us your interested products, quantity, destination country, shipping question, or gift packaging question."
                  rows={5}
                  className="resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting" || status === "success"}
                className="w-full rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400 sm:w-auto"
              >
                {status === "submitting"
                  ? "Sending request..."
                  : status === "success"
                    ? "Request sent"
                    : "Submit Order Request"}
              </button>

              {status === "success" && (
                <div
                  aria-live="polite"
                  className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold leading-6 text-green-700"
                >
                  Your order request has been sent. We will reply by email with
                  availability, shipping, final cost, and payment details.
                </div>
              )}

              {status === "error" && (
                <div
                  aria-live="polite"
                  className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-700"
                >
                  {errorMessage}
                </div>
              )}

              <p className="text-xs leading-5 text-stone-500">
                Your request will be saved for reply. If your request cart
                contains products, the selected items and price reference will
                also be submitted together. This request does not require
                payment before email confirmation.
              </p>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
