// netlify/functions/update-profile.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // ⚠️ must be service key, not anon
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { user_id, name } = JSON.parse(event.body || "{}");

    if (!user_id || !name) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing user_id or name" }),
      };
    }

    // ✅ Update auth user metadata
    const { error } = await supabase.auth.admin.updateUserById(user_id, {
      user_metadata: { name },
    });

    if (error) {
      console.error("Supabase update error:", error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Profile updated successfully" }),
    };
  } catch (err) {
    console.error("update-profile error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unexpected server error" }),
    };
  }
}
