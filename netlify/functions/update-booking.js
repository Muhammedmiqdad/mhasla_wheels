// netlify/functions/update-booking.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 403, body: JSON.stringify({ error: "Unauthorized" }) };
  }

  try {
    const { booking_code, status, reason } = JSON.parse(event.body || "{}");

    if (!booking_code || !status) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing booking_code or status" }),
      };
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({
        status,
        admin_comment: reason || null,
        updated_at: new Date().toISOString(),
      })
      .eq("booking_code", booking_code) // ✅ match on booking_code, not UUID
      .select()
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking updated successfully", booking: data }),
    };
  } catch (err) {
    console.error("update-booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || "Error updating booking" }),
    };
  }
}
