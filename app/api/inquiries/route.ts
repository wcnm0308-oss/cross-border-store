import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

type CartItem = {
  id?: string;
  slug?: string;
  name?: string;
  price?: number;
  currency?: string;
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
  website?: string;
  honeypot?: string;
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

type InquiryEmailParams = {
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
};

function getCartItemDetails(item: CartItem) {
  const name = item.name || "Unknown product";
  const slugOrId = item.slug || item.id || "No slug or id submitted";
  const price = typeof item.price === "number" ? item.price : 0;
  const currency = item.currency || "USD";
  const quantity = typeof item.quantity === "number" ? item.quantity : 1;

  return {
    name,
    slugOrId,
    price,
    currency,
    quantity,
  };
}

function formatCartItemsForText(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return "No cart items submitted.";
  }

  return cartItems
    .map((item, index) => {
      const details = getCartItemDetails(item);

      return `${index + 1}. ${details.name} (${details.slugOrId}) x ${
        details.quantity
      } - ${details.price.toFixed(2)} ${
        details.currency
      } price reference`;
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

function renderCartItemsHtml(cartItems: CartItem[]) {
  if (cartItems.length === 0) {
    return "<p>No selected cart products were submitted.</p>";
  }

  const rows = cartItems
    .map((item) => {
      const details = getCartItemDetails(item);
      const safeName = escapeHtml(details.name);
      const safeSlugOrId = escapeHtml(details.slugOrId);
      const safeCurrency = escapeHtml(details.currency);

      return `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">${safeName}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">${safeSlugOrId}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">${details.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e7e5e4;">${details.price.toFixed(
            2
          )} ${safeCurrency}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table style="border-collapse: collapse; width: 100%; margin-top: 8px;">
      <thead>
        <tr>
          <th align="left" style="padding: 8px; border-bottom: 1px solid #d6d3d1;">Product name</th>
          <th align="left" style="padding: 8px; border-bottom: 1px solid #d6d3d1;">Slug / ID</th>
          <th align="left" style="padding: 8px; border-bottom: 1px solid #d6d3d1;">Quantity</th>
          <th align="left" style="padding: 8px; border-bottom: 1px solid #d6d3d1;">Price reference</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function sendAdminNotification(params: InquiryEmailParams) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.INQUIRY_NOTIFY_EMAIL;

  if (!resendApiKey || !notifyEmail) {
    console.warn("Resend admin notification environment variables are missing.");
    return;
  }

  const resend = new Resend(resendApiKey);

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
  const safeCreatedAt = escapeHtml(params.createdAt || new Date().toISOString());
  const cartItemsHtml = renderCartItemsHtml(params.cartItems);
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
    subject: `New order request received from ${params.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New order request received</h2>

        <p>A customer submitted an order request from your cross-border store.</p>

        <h3>Customer information</h3>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Country:</strong> ${safeCountry}</p>
        <p><strong>Company:</strong> ${safeCompanyName}</p>
        <p><strong>Phone:</strong> ${safePhone}</p>
        <p><strong>WhatsApp:</strong> ${safeWhatsapp}</p>

        <h3>Selected products</h3>
        ${cartItemsHtml}
        <p><strong>Interested product field:</strong> ${safeInterestedProduct}</p>
        <p><strong>Expected quantity field:</strong> ${safeQuantity}</p>

        <h3>Estimated product total</h3>
        <p><strong>Price reference only:</strong> $${params.cartTotal.toFixed(
          2
        )} USD</p>
        <p>This does not include shipping, taxes, or final payment arrangement.</p>

        <h3>Customer message / requirements</h3>
        <p><strong>Requirements:</strong></p>
        <p style="white-space: pre-line;">${safeRequirements}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-line;">${safeMessage}</p>

        <h3>Source</h3>
        <p><strong>Source Page:</strong> ${safeSourcePage}</p>
        <p><strong>Admin Detail:</strong> ${safeAdminDetailLink}</p>
        <p><strong>Submitted At:</strong> ${safeCreatedAt}</p>

        <h3>Reminder</h3>
        <p><strong>This is not a paid order.</strong></p>
        <p>Confirm availability, shipping estimate, final cost, and payment details before asking the customer to pay.</p>
      </div>
    `,
  });
}

async function sendCustomerConfirmation(params: InquiryEmailParams) {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("Resend customer confirmation environment variable is missing.");
    return;
  }

  const resend = new Resend(resendApiKey);

  const safeName = escapeHtml(params.name);
  const safeCountry = escapeHtml(params.country || "Not specified");
  const safeInterestedProduct = escapeHtml(
    params.interestedProduct || "Not specified"
  );
  const safeMessage = escapeHtml(params.message || "No message submitted.");
  const safeRequirements = escapeHtml(
    params.requirements || "No additional questions submitted."
  );
  const safeCartText = escapeHtml(formatCartItemsForText(params.cartItems));

  await resend.emails.send({
    from: "Cross Border Store <onboarding@resend.dev>",
    to: params.email,
    subject: "We received your order request",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>We received your order request</h2>

        <p>Hi ${safeName},</p>

        <p>Thank you for your order request.</p>

        <p><strong>This is not a paid order yet.</strong> You do not need to pay now.</p>

        <p>We will review product availability, shipping estimate, final cost, and payment details. We will reply by email.</p>

        <h3>Your request summary</h3>
        <p><strong>Country:</strong> ${safeCountry}</p>
        <p><strong>Products mentioned:</strong> ${safeInterestedProduct}</p>

        <h3>Selected products</h3>
        <pre style="white-space: pre-wrap; background: #f5f5f4; padding: 12px; border-radius: 12px;">${safeCartText}</pre>
        <p>This product total is a price reference only. It does not include shipping, taxes, or final payment arrangement.</p>

        <h3>Your message</h3>
        <p style="white-space: pre-line;">${safeMessage}</p>

        <h3>Additional questions</h3>
        <p style="white-space: pre-line;">${safeRequirements}</p>

        <p>After we review the details, you can decide whether to continue with payment.</p>
      </div>
    `,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InquiryRequestBody;
    const honeypotValue = `${body.website || ""}${body.honeypot || ""}`.trim();

    if (honeypotValue) {
      return NextResponse.json({ ok: true, success: true });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Order request service is temporarily unavailable.",
        },
        { status: 500 }
      );
    }

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
      await sendAdminNotification({
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
      console.error("Failed to send admin notification email:", emailError);
    }

    try {
      await sendCustomerConfirmation({
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
      console.error("Failed to send customer confirmation email:", emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order request submitted successfully.",
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
