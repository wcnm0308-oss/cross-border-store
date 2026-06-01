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
      interestedProduct: String(formData.get("interestedProduct") || "").trim(),
      country: String(formData.get("country") || "").trim(),
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
              Submit Inquiry
            </p>

            <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
              Tell us your product requirements.
            </h1>

            <p className="mt-6 text-lg leading-8 text-stone-600">
              We will review your request and contact you with pricing, MOQ,
              shipping options, and lead time.
            </p>

            <div className="mt-8 rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold">Request a Quote</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                Share the products, target quantity, destination country, and
                any packaging or shipping requirements. Our team will follow up
                with quote details by email.
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
                <span className="text-sm font-semibold">Country / Region</span>
                <input
                  name="country"
                  type="text"
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
                  required
                  placeholder="Product name or product category"
                  className="rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold">Message</span>
                <textarea
                  name="message"
                  required
                  placeholder="Tell us your target quantity, destination country, shipping questions, packaging needs, or wholesale request."
                  rows={5}
                  className="resize-none rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-950"
                />
              </label>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="rounded-full bg-stone-950 px-8 py-4 text-sm font-semibold text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-400"
              >
                {status === "submitting" ? "Submitting..." : "Submit Inquiry"}
              </button>

              {status === "success" && (
                <div className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                  Inquiry submitted successfully. We will review your request
                  and contact you by email.
                </div>
              )}

              {status === "error" && (
                <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              <p className="text-xs leading-5 text-stone-500">
                Your inquiry will be saved into our database. If your inquiry
                cart contains products, the selected items and estimated product
                total will also be submitted together.
              </p>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
