import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { name, rating, comments } = JSON.parse(event.body);

    const { error } = await supabase
      .from("feedbacks")
      .insert([{ name, rating, comments }]);

    if (error) throw error;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Feedback submitted successfully!" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error submitting feedback" }),
    };
  }
}
