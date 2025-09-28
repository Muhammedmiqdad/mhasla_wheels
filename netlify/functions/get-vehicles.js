// netlify/functions/get-vehicles.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

export async function handler() {
  try {
    const { data, error } = await supabase
      .from("vehicles")
      .select(
        "id, name, type, capacity, per_km_rate, base_rate, image_url, availability"
      )
      .eq("availability", true)
      .order("created_at", { ascending: true });

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true, vehicles: data }),
    };
  } catch (err) {
    console.error("get-vehicles error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: err.message }),
    };
  }
}
