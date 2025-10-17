// netlify/functions/update-vehicle.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST" && event.httpMethod !== "PUT") {
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
    let { id, ...updates } = JSON.parse(event.body || "{}");

    if (!id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing vehicle ID" }),
      };
    }

    // ✅ Sanitize numeric fields
    ["capacity", "per_km_rate", "base_rate"].forEach((field) => {
      if (updates[field] === "" || updates[field] === undefined) {
        updates[field] = null;
      } else if (!isNaN(updates[field])) {
        updates[field] = Number(updates[field]);
      }
    });

    // ✅ Ensure availability is boolean
    if (updates.hasOwnProperty("availability")) {
      updates.availability = Boolean(updates.availability);
    }

    // ✅ Properly handle image_url updates
    if (updates.hasOwnProperty("image_url")) {
      if (typeof updates.image_url === "string" && updates.image_url.trim() !== "") {
        updates.image_url = updates.image_url.trim();
      } else {
        // If user explicitly clears image, set it to null
        updates.image_url = null;
      }
    }

    console.log("🔄 Updating vehicle:", id, updates);

    const { data, error } = await supabase
      .from("vehicles")
      .update(updates)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Vehicle updated successfully",
        vehicle: data,
      }),
    };
  } catch (err) {
    console.error("❌ update-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
