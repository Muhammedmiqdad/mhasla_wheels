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

    const {
      name,
      phone,
      email,
      pickup_location,
      drop_location,
      journey_type,
      depart_date,
      depart_time,
      return_date,
      return_time,
      vehicle_id,
      coupon_code,
      customer_id,
    } = payload;

    if (!pickup_location) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required field: pickup_location",
        }),
      };
    }

    const safeName = name || "Guest";
    const safePhone = phone || "";
    const safeEmail = email || "";

    // ✅ Ensure ride_date is never null
    let ride_date;
    if (depart_date) {
      if (depart_time) {
        ride_date = new Date(`${depart_date}T${depart_time}`).toISOString();
      } else {
        ride_date = new Date(`${depart_date}T00:00`).toISOString();
      }
    } else {
      ride_date = new Date().toISOString();
    }

    const booking_code = `MB-${uuidv4().split("-")[0]}`;

    const { data, error } = await supabase
      .from("bookings")
      .insert([
        {
          id: uuidv4(),
          booking_code,
          customer_id: customer_id || null,
          name: safeName,
          phone: safePhone,
          email: safeEmail,
          pickup_location,
          drop_location: drop_location || null,
          journey_type: journey_type || null,
          depart_date: depart_date || null,
          depart_time: depart_time || null,
          return_date: return_date || null,
          return_time: return_time || null,
          vehicle_id: vehicle_id || null,
          coupon_code: coupon_code || null,
          status: "pending",
          ride_date,
        },
      ])
      .select("*")
      .single();

    if (error) throw error;

    // ✅ SendGrid email to customer (non-blocking)
    if (process.env.SENDGRID_API_KEY && safeEmail) {
      (async () => {
        try {
          await sgMail.send({
            to: safeEmail,
            from: process.env.SENDGRID_FROM || "no-reply@mhaslawheels.com",
            subject: `Booking Received • ${booking_code}`,
            html: `<p>Hi ${safeName},</p>
                   <p>We received your booking <strong>${booking_code}</strong>. Pickup: ${pickup_location}.</p>
                   <p>Status: Pending. We'll update you when it's confirmed.</p>`,
            text: `Hi ${safeName},\n\nWe received your booking ${booking_code}. Pickup: ${pickup_location}.\n\nStatus: Pending.`,
          });
        } catch (mailErr) {
          console.warn("SendGrid error (non-blocking):", mailErr?.message || mailErr);
        }
      })();
    }

    // ✅ Notify admins if ADMIN_EMAILS exists
    if (process.env.SENDGRID_API_KEY && process.env.ADMIN_EMAILS) {
      (async () => {
        try {
          const admins = process.env.ADMIN_EMAILS.split(",").map((s) => s.trim()).filter(Boolean);
          if (admins.length > 0) {
            await sgMail.send({
              to: admins,
              from: process.env.SENDGRID_FROM || "no-reply@mhaslawheels.com",
              subject: `New Booking Request • ${booking_code}`,
              html: `<p><strong>New booking request</strong></p>
                     <ul>
                       <li><strong>Booking Code:</strong> ${booking_code}</li>
                       <li><strong>Name:</strong> ${safeName}</li>
                       <li><strong>Phone:</strong> ${safePhone || "-"}</li>
                       <li><strong>Email:</strong> ${safeEmail || "-"}</li>
                       <li><strong>Ride Date:</strong> ${ride_date}</li>
                       <li><strong>Pickup:</strong> ${pickup_location}</li>
                       <li><strong>Drop:</strong> ${drop_location || "-"}</li>
                     </ul>`,
            });
          }
        } catch (adminMailErr) {
          console.warn("Admin notification error (non-blocking):", adminMailErr?.message || adminMailErr);
        }
      })();
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
      body: JSON.stringify({
        message: "Error creating booking",
        error: err?.message || err,
      }),
    };
  }
}
