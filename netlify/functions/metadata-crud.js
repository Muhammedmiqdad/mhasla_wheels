// /.netlify/functions/metadata-crud.js
import { createClient } from "@supabase/supabase-js";

// ✅ Initialize Supabase client with service role key (for admin operations)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  // ✅ Admin token check
  const token = event.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const method = event.httpMethod;

    // ✅ Fetch all metadata records
    if (method === "GET") {
      const { data, error } = await supabase
        .from("metadata")
        .select("*")
        .order("page_name", { ascending: true });

      if (error) throw error;
      return {
        statusCode: 200,
        body: JSON.stringify(data),
      };
    }

    // ✅ Parse body safely
    const body = JSON.parse(event.body || "{}");

    // ✅ Add new metadata
    if (method === "POST") {
      const { data, error } = await supabase
        .from("metadata")
        .insert([
          {
            page_name: body.page_name,
            site_title: body.site_title,
            site_description: body.site_description,
            meta_keywords: body.meta_keywords,
            og_image_url: body.og_image_url,
          },
        ])
        .select();

      if (error) throw error;
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data }),
      };
    }

    // ✅ Update existing metadata
    if (method === "PUT") {
      const { id, ...updates } = body;
      if (!id)
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing ID for update" }),
        };

      const { data, error } = await supabase
        .from("metadata")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data }),
      };
    }

    // ✅ Delete metadata record
    if (method === "DELETE") {
      const { id } = body;
      if (!id)
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing ID for delete" }),
        };

      const { error } = await supabase.from("metadata").delete().eq("id", id);
      if (error) throw error;

      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    // ✅ Method not supported
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  } catch (err) {
    console.error("❌ metadata-crud error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
