// netlify/functions/admin-login.js
export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { username, password } = JSON.parse(event.body || "{}");

    // ✅ Server-side secrets (safe in Netlify env)
    const ADMIN_USER = process.env.ADMIN_USER || "admin";
    const ADMIN_PASS = process.env.ADMIN_PASS || "secret123";
    const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "supersecrettoken123";

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          ok: true,
          token: ADMIN_TOKEN,
          message: "Login successful",
        }),
      };
    }

    return {
      statusCode: 401,
      body: JSON.stringify({ ok: false, message: "Invalid credentials" }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: err.message }),
    };
  }
}
