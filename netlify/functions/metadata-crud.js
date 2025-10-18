import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  const token = event.headers["x-admin-token"];
  if (token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: "Unauthorized" };
  }

  try {
    const method = event.httpMethod;

    if (method === "GET") {
      const { data, error } = await supabase.from("settings").select("*").order("id", { ascending: false });
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify(data) };
    }

    const body = JSON.parse(event.body || "{}");

    if (method === "POST") {
      const { data, error } = await supabase.from("settings").insert([body]).select();
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
    }

    if (method === "PUT") {
      const { id, ...updates } = body;
      const { data, error } = await supabase.from("settings").update(updates).eq("id", id).select();
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
    }

    if (method === "DELETE") {
      const { id } = body;
      const { error } = await supabase.from("settings").delete().eq("id", id);
      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    }

    return { statusCode: 405, body: "Method Not Allowed" };
  } catch (err) {
    console.error("❌ metadata-crud error:", err);
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
