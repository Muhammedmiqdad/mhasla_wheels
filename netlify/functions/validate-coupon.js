// netlify/functions/validate-coupon.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { code } = JSON.parse(event.body || "{}");
    if (!code) {
      return {
        statusCode: 400,
        body: JSON.stringify({ ok: false, message: "Coupon code required" }),
      };
    }

    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.trim().toUpperCase())
      .maybeSingle();

    if (error) throw error;

    if (!coupon) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Invalid coupon" }),
      };
    }

    // ✅ Validation checks
    const now = new Date();
    if (!coupon.active) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon is inactive" }),
      };
    }
    if (coupon.valid_from && new Date(coupon.valid_from) > now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon not valid yet" }),
      };
    }
    if (coupon.valid_to && new Date(coupon.valid_to) < now) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon expired" }),
      };
    }
    if (coupon.usage_limit && coupon.uses_count >= coupon.usage_limit) {
      return {
        statusCode: 200,
        body: JSON.stringify({ ok: false, message: "Coupon usage limit reached" }),
      };
    }

    // ✅ Valid coupon → build discount response
    const discount = coupon.discount_flat
      ? { type: "flat", value: coupon.discount_flat }
      : { type: "percent", value: coupon.discount_percent };

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        message: "Coupon applied successfully",
        discount,
      }),
    };
  } catch (err) {
    console.error("validate-coupon error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: err.message }),
    };
  }
}
