import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// Initialize Supabase client with environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Extract form data
    const {
      name,
      phone,
      email,
      ride_date,
      pickup_location,
      drop_time,
      ride_type,
    } = data;

    // Insert into Supabase
    const { error } = await supabase.from("bookings").insert([
      {
        id: uuidv4(),
        name,
        phone,
        email,
        ride_date,
        pickup_location,
        drop_time,
        ride_type,
        status: "pending", // default
      },
    ]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Booking submitted successfully!" }),
    };
  } catch (err) {
    console.error("Booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create booking" }),
    };
  }
}
