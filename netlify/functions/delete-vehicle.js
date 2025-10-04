// netlify/functions/delete-vehicle.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  // ✅ Allow POST or DELETE
  if (event.httpMethod !== "POST" && event.httpMethod !== "DELETE") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
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
    const { id } = JSON.parse(event.body || "{}");

    if (!id || typeof id !== "string") {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing or invalid vehicle ID" }),
      };
    }

    const { data, error } = await supabase
      .from("vehicles")
      .delete()
      .eq("id", id)
      .select("*") // return deleted row for confirmation
      .single();

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "✅ Vehicle deleted successfully",
        deleted: data,
      }),
    };
  } catch (err) {
    console.error("delete-vehicle error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
