// netlify/functions/create-booking.js
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import sgMail from "@sendgrid/mail";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const payload = JSON.parse(event.body || "{}");
    const { name, phone, email, ride_date, pickup_location, drop_time = null, ride_type = "Private" } = payload;

    // Basic validation
    if (!name || !phone || !ride_date || !pickup_location) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields: name, phone, ride_date, pickup_location" }),
      };
    }

    // Generate booking_code (human-friendly)
    const booking_code = `MB-${uuidv4().split("-")[0]}`;

    // Insert into Supabase bookings table
    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          booking_code,
          name,
          phone,
          email,
          ride_date,
          pickup_location,
          drop_time,
          ride_type,
          status: "pending",
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // Optional: Send admin email notification
    if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAILS) {
      try {
        const admins = process.env.ADMIN_EMAILS.split(",").map((s) => s.trim()).filter(Boolean);

        const subject = `New Booking Request • ${booking_code}`;
        const html = `
          <p><strong>New booking request</strong></p>
          <ul>
            <li><strong>Booking Code:</strong> ${booking_code}</li>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Phone:</strong> ${phone}</li>
            <li><strong>Email:</strong> ${email || "-"}</li>
            <li><strong>Ride Date:</strong> ${ride_date}</li>
            <li><strong>Pickup Location:</strong> ${pickup_location}</li>
            <li><strong>Drop Time:</strong> ${drop_time || "-"}</li>
            <li><strong>Ride Type:</strong> ${ride_type}</li>
          </ul>
        `;

        const msg = {
          to: admins,
          from: process.env.NOTIFICATION_FROM || "no-reply@mhaslawheels.com",
          subject,
          html,
        };

        await sgMail.send(msg);
      } catch (notifyErr) {
        console.error("Failed to send admin notification:", notifyErr);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Booking submitted successfully!",
        booking: data,
      }),
    };
  } catch (err) {
    console.error("create-booking error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error creating booking", error: err?.message || err }),
    };
  }
}
