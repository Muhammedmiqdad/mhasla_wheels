// netlify/functions/create-vehicle.js
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

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
    return {
      statusCode: 403,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    let {
      name,
      type,
      capacity,
      per_km_rate,
      base_rate,
      image_url,
      availability, // ✅ new field
    } = payload;

    if (!name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Vehicle name is required" }),
      };
    }

    // ✅ sanitize numeric fields
    capacity =
      capacity === "" || capacity === undefined ? null : Number(capacity);
    per_km_rate =
      per_km_rate === "" || per_km_rate === undefined
        ? null
        : Number(per_km_rate);
    base_rate =
      base_rate === "" || base_rate === undefined ? null : Number(base_rate);

    // ✅ ensure availability is boolean (default true)
    availability = availability === undefined ? true : Boolean(availability);

    const { data, error } = await supabase
      .from("vehicles")
      .insert([
        {
          id: uuidv4(),
          name,
          type: type || null,
          capacity,
          per_km_rate,
          base_rate,
          image_url: image_url || null,
          availability, // ✅ save availability
        },
      ])
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
    console.error("create-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
