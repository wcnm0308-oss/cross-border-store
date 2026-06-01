import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type CartItem = {
  id?: string;
  slug?: string;
  name?: string;
  price?: number;
  quantity?: number;
};

type InquiryRequestBody = {
  name?: string;
  email?: string;
  interestedProduct?: string;
  message?: string;
  country?: string;
  sourcePage?: string;
  cartItems?: CartItem[];
  cartTotal?: number;
};

function formatCartItems(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return "No cart items submitted.";
  }

  return cartItems
    .map((item, index) => {
      const name = item.name || item.slug || item.id || "Unknown product";
      const price = typeof item.price === "number" ? item.price : 0;
      const quantity = typeof item.quantity === "number" ? item.quantity : 1;

      return `${index + 1}. ${name} × ${quantity} - $${price}`;
    })
    .join("\n");
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendInquiryNotification(params: {
  name: string;
  email: string;
  interestedProduct: string | null;
  message: string | null;
  country: string | null;
  sourcePage: string;
  cartItems: CartItem[];
  cartTotal: number;
  createdAt?: string;
}) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INQUIRY_NOTIFY_EMAIL;

  if (!resendApiKey || !notifyEmail) {
    console.warn("Resend environment variables are missing.");
    return;
  }

  const resend = new Resend(resendApiKey);

  const cartText = formatCartItems(params.cartItems);

  const safeName = escapeHtml(params.name);
  const safeEmail = escapeHtml(params.email);
  const safeInterestedProduct = escapeHtml(
    params.interestedProduct || "Not specified"
  );
  const safeCountry = escapeHtml(params.country || "Not specified");
  const safeMessage = escapeHtml(params.message || "No message submitted.");
  const safeSourcePage = escapeHtml(params.sourcePage);
  const safeCartText = escapeHtml(cartText);
  const safeCreatedAt = escapeHtml(params.createdAt || new Date().toISOString());

  await resend.emails.send({
    from: "Cross Border Store <onboarding@resend.dev>",
    to: notifyEmail,
    subject: `New inquiry from ${params.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New Customer Inquiry</h2>

        <p>A new inquiry has been submitted from your cross-border store.</p>

        <h3>Customer Info</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Country / Region:</strong> ${safeCountry}</p>

        <h3>Inquiry Details</h3>
        <p><strong>Interested Product:</strong> ${safeInterestedProduct}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${safeMessage}</p>

        <h3>Cart Info</h3>
        <p><strong>Estimated Cart Total:</strong> $${params.cartTotal.toFixed(
          2
        )}</p>
        <pre style="white-space: pre-wrap; background: #f5f5f4; padding: 12px; border-radius: 12px;">${safeCartText}</pre>

        <h3>Source</h3>
        <p><strong>Source Page:</strong> ${safeSourcePage}</p>
        <p><strong>Submitted At:</strong> ${safeCreatedAt}</p>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Supabase environment variables are missing.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as InquiryRequestBody;

    const name = body.name?.trim();
    const email = body.email?.trim();
    const interestedProduct = body.interestedProduct?.trim() || null;
    const message = body.message?.trim() || null;
    const country = body.country?.trim() || null;
    const sourcePage = body.sourcePage?.trim() || "/contact";
    const cartItems = Array.isArray(body.cartItems) ? body.cartItems : [];
    const cartTotal =
      typeof body.cartTotal === "number" && Number.isFinite(body.cartTotal)
        ? body.cartTotal
        : 0;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required.",
        },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        name,
        email,
        interested_product: interestedProduct,
        message,
        country,
        source_page: sourcePage,
        cart_items: cartItems,
        cart_total: cartTotal,
        status: "new",
      })
      .select("id, created_at")
      .single();

    if (error) {
      console.error("Failed to create inquiry:", error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to submit inquiry.",
        },
        { status: 500 }
      );
    }

    try {
      await sendInquiryNotification({
        name,
        email,
        interestedProduct,
        message,
        country,
        sourcePage,
        cartItems,
        cartTotal,
        createdAt: data.created_at,
      });
    } catch (emailError) {
      console.error("Failed to send inquiry notification email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Inquiry submitted successfully.",
        inquiry: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected inquiry API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unexpected server error.",
      },
      { status: 500 }
    );
  }
}