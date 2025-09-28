// netlify/functions/get-customer-bookings.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const customer_id = event.queryStringParameters.customer_id;
  if (!customer_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing customer_id" }),
    };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(
        "booking_code, pickup_location, drop_location, journey_type, status, created_at"
      )
      .eq("customer_id", customer_id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: data }),
    };
  } catch (err) {
    console.error("get-customer-bookings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
