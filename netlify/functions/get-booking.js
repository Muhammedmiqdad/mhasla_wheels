// functions/get-booking.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();

  console.log("DEBUG: Received Authorization header =", auth);
  console.log("DEBUG: Parsed token =", token);
  console.log("DEBUG: Expected ADMIN_TOKEN =", process.env.ADMIN_TOKEN);

  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: data }),
    };
  } catch (err) {
    console.error("getBookings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
