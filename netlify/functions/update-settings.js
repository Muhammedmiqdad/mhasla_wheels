import { createClient } from "@supabase/supabase-js";
import jwt from "jsonwebtoken";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    const token = event.headers.authorization?.replace("Bearer ", "");
    if (token !== process.env.ADMIN_TOKEN) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "Unauthorized" }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    // ✅ fetch first settings record (regardless of ID type)
    const { data: settings } = await supabase
      .from("settings")
      .select("id")
      .limit(1)
      .single();

    if (!settings) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Settings record not found" }),
      };
    }

    // ✅ Update using UUID fetched above
    const { error } = await supabase
      .from("settings")
      .update({
        phone: body.phone,
        email: body.email,
        address: body.address,
        whatsapp_link: body.whatsapp_link,
        facebook_link: body.facebook_link,
        instagram_link: body.instagram_link,
        twitter_link: body.twitter_link,
        linkedin_link: body.linkedin_link,
      })
      .eq("id", settings.id);

    if (error) {
      console.error("❌ Supabase error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("❌ Unexpected error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
