import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RenovationRequest {
  id: string;
  property_type: string;
  location: string;
  sqm: number;
  scope: string;
  condition: string;
  material: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = (await req.json()) as { record: RenovationRequest };

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Send notification email using Supabase's built-in email
    const emailHtml = `
      <h2>Novi zahtjev za ponudu!</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Ime</td><td style="padding:8px;border:1px solid #ddd">${record.name}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Email</td><td style="padding:8px;border:1px solid #ddd">${record.email}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Telefon</td><td style="padding:8px;border:1px solid #ddd">${record.phone}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Tip nekretnine</td><td style="padding:8px;border:1px solid #ddd">${record.property_type}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Lokacija</td><td style="padding:8px;border:1px solid #ddd">${record.location}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Kvadratura</td><td style="padding:8px;border:1px solid #ddd">${record.sqm} m²</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Opseg radova</td><td style="padding:8px;border:1px solid #ddd">${record.scope}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Stanje</td><td style="padding:8px;border:1px solid #ddd">${record.condition}</td></tr>
        <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Materijali</td><td style="padding:8px;border:1px solid #ddd">${record.material}</td></tr>
        ${record.message ? `<tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold">Poruka</td><td style="padding:8px;border:1px solid #ddd">${record.message}</td></tr>` : ""}
      </table>
    `;

    // Log the request for now (email sending requires SMTP config)
    console.log("New renovation request received:", record.id);
    console.log("Email would be sent with content:", emailHtml);

    return new Response(
      JSON.stringify({ success: true, message: "Notification processed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
