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
  companyName?: string;
  company_name?: string;
  phone?: string;
  whatsapp?: string;
  interestedProduct?: string;
  message?: string;
  requirements?: string;
  country?: string;
  quantity?: string;
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
  companyName: string | null;
  phone: string | null;
  whatsapp: string | null;
  interestedProduct: string | null;
  message: string | null;
  requirements: string | null;
  country: string | null;
  quantity: string | null;
  sourcePage: string;
  cartItems: CartItem[];
  cartTotal: number;
  inquiryId?: string;
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
  const safeCompanyName = escapeHtml(params.companyName || "Not specified");
  const safePhone = escapeHtml(params.phone || "Not specified");
  const safeWhatsapp = escapeHtml(params.whatsapp || "Not specified");
  const safeInterestedProduct = escapeHtml(
    params.interestedProduct || "Not specified"
  );
  const safeCountry = escapeHtml(params.country || "Not specified");
  const safeQuantity = escapeHtml(params.quantity || "Not specified");
  const safeRequirements = escapeHtml(
    params.requirements || "No requirements submitted."
  );
  const safeMessage = escapeHtml(params.message || "No message submitted.");
  const safeSourcePage = escapeHtml(params.sourcePage);
  const safeCartText = escapeHtml(cartText);
  const safeCreatedAt = escapeHtml(params.createdAt || new Date().toISOString());
  const detailPath = params.inquiryId
    ? `/admin/inquiries/${encodeURIComponent(params.inquiryId)}`
    : "/admin/inquiries";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
      : "";
  const safeAdminDetailLink = escapeHtml(
    siteUrl ? `${siteUrl}${detailPath}` : detailPath
  );

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
        <p><strong>Company:</strong> ${safeCompanyName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>WhatsApp:</strong> ${safeWhatsapp}</p>
        <p><strong>Destination Country:</strong> ${safeCountry}</p>

        <h3>Inquiry Details</h3>
        <p><strong>Interested Product:</strong> ${safeInterestedProduct}</p>
        <p><strong>Estimated Quantity:</strong> ${safeQuantity}</p>
        <p><strong>Requirements:</strong></p>
        <p style="white-space: pre-line;">${safeRequirements}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${safeMessage}</p>

        <h3>Cart Info</h3>
        <p><strong>Estimated Cart Total:</strong> $${params.cartTotal.toFixed(
          2
        )}</p>
        <pre style="white-space: pre-wrap; background: #f5f5f4; padding: 12px; border-radius: 12px;">${safeCartText}</pre>

        <h3>Source</h3>
        <p><strong>Source Page:</strong> ${safeSourcePage}</p>
        <p><strong>Admin Detail:</strong> ${safeAdminDetailLink}</p>
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
    const companyName =
      body.companyName?.trim() || body.company_name?.trim() || null;
    const phone = body.phone?.trim() || null;
    const whatsapp = body.whatsapp?.trim() || null;
    const interestedProduct = body.interestedProduct?.trim() || null;
    const message = body.message?.trim() || null;
    const requirements = body.requirements?.trim() || null;
    const country = body.country?.trim() || null;
    const quantity = body.quantity?.trim() || null;
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
    const baseInquiryPayload = {
      name,
      email,
      interested_product: interestedProduct,
      message,
      country,
      source_page: sourcePage,
      cart_items: cartItems,
      cart_total: cartTotal,
      status: "new",
    };
    const extendedInquiryPayload = {
      ...baseInquiryPayload,
      company_name: companyName,
      phone,
      whatsapp,
      quantity,
      requirements,
    };

    let { data, error } = await supabase
      .from("inquiries")
      .insert(extendedInquiryPayload)
      .select("id, created_at")
      .single();

    if (error) {
      console.warn(
        "Extended inquiry insert failed; retrying with base fields:",
        error
      );

      const fallbackResult = await supabase
        .from("inquiries")
        .insert(baseInquiryPayload)
        .select("id, created_at")
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

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

    if (!data) {
      console.error("Failed to create inquiry: no record returned.");

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
        companyName,
        phone,
        whatsapp,
        interestedProduct,
        message,
        requirements,
        country,
        quantity,
        sourcePage,
        cartItems,
        cartTotal,
        inquiryId: data.id,
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
