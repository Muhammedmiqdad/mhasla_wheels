// netlify/functions/get-booking.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const booking_code = event.queryStringParameters.code;

  if (!booking_code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: "Missing booking_code" }),
    };
  }

  try {
    // ✅ Fetch single booking + join with vehicles
    const { data, error } = await supabase
      .from("bookings")
      .select(
        `
        *,
        vehicle:vehicles(id, name, type, capacity, per_km_rate, image_url)
      `
      )
      .eq("booking_code", booking_code)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ ok: false, message: "Booking not found" }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, booking: data }),
    };
  } catch (err) {
    console.error("get-booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: "Error fetching booking",
        error: err.message,
      }),
    };
  }
}
