// netlify/functions/create-vehicle.js
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  // Allow only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // ✅ Admin authentication
  const auth = event.headers.authorization || "";
  const token = auth.replace("Bearer ", "").trim();
  if (token !== process.env.ADMIN_TOKEN) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    // ✅ Parse request body
    const payload = JSON.parse(event.body || "{}");
    let {
      name,
      type,
      capacity,
      per_km_rate,
      base_rate,
      image_url,
      availability,
    } = payload;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Vehicle name is required" }),
      };
    }

    // ✅ Sanitize numeric fields
    const safeCapacity =
      capacity === "" || capacity === undefined ? null : Number(capacity);
    const safePerKm =
      per_km_rate === "" || per_km_rate === undefined
        ? null
        : Number(per_km_rate);
    const safeBaseRate =
      base_rate === "" || base_rate === undefined ? null : Number(base_rate);

    // ✅ Ensure availability is boolean (default = true)
    const safeAvailability =
      availability === undefined || availability === "" ? true : Boolean(availability);

    // ✅ Ensure image_url is properly set
    const safeImageUrl =
      typeof image_url === "string" && image_url.trim() !== ""
        ? image_url
        : null;

    // ✅ Prepare the insert object
    const vehicleData = {
      id: uuidv4(),
      name,
      type: type || null,
      capacity: safeCapacity,
      per_km_rate: safePerKm,
      base_rate: safeBaseRate,
      image_url: safeImageUrl,
      availability: safeAvailability,
      created_at: new Date().toISOString(), // ✅ safe (column exists)
    };

    // ⚠️ Do NOT include `updated_at` if your table doesn’t have it.
    // If you later add that column, you can re-enable this line:
    // vehicleData.updated_at = new Date().toISOString();

    // ✅ Insert into Supabase
    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicleData])
      .select("*")
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Vehicle created successfully",
        vehicle: data,
      }),
    };
  } catch (err) {
    console.error("❌ create-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
