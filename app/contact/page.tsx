"use client";

import { FormEvent, useState } from "react";

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

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
        "Submit failed. Please check your network and try again."
      );
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
              Ask about a product or request an order.
            </h1>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              Before online checkout is ready, you can ask about availability,
              international shipping, final cost, and payment details.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Ask Before Buying</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Share the product you like, your country, expected quantity, and
                any delivery questions. We will reply by email before payment.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] border border-stone-200 bg-white p-6 shadow-sm"
          >
            <div className="grid gap-5">
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
                  Company Name Optional
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
                  <span className="text-sm font-semibold">Phone Optional</span>
                  <input
                    name="phone"
                    type="text"
                    placeholder="+1 555 000 0000"
                    className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold">
                    WhatsApp Optional
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
                  Destination Country
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
                  Interested Product
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
                  Estimated Quantity
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
                  Order Questions Optional
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
                  placeholder="Tell us what you want to order and what you need to confirm before payment."
                  rows={5}
                  className="resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {status === "submitting" ? "Submitting..." : "Submit Request"}
              </button>

              {status === "success" && (
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  Request submitted successfully. We will review your message
                  and contact you by email.
                </div>
              )}

              {status === "error" && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              <p className="text-xs leading-5 text-stone-500">
                Your request will be saved for reply. If your inquiry cart
                contains products, the selected items and price reference will
                also be submitted together.
              </p>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
