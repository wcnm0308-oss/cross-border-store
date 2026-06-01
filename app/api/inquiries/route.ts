import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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