// netlify/functions/get-bookings.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();

  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        id,
        booking_code,
        customer_id,
        name,
        phone,
        email,
        pickup_location,
        drop_location,
        journey_type,
        custom_journey_details,
        custom_rate,         
        custom_unit,         
        depart_date,
        depart_time,
        return_date,
        return_time,
        vehicle_id,
        coupon_code,
        status,
        ride_date,
        created_at,
        updated_at,
        admin_comment
      `)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: data }),
    };
  } catch (err) {
    console.error("get-bookings error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
