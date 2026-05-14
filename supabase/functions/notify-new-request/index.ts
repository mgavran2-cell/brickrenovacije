const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RenovationRequest {
  id: string;
  property_type: string;
  location: string;
  sqm: number | null;
  scope: string | string[];
  condition: string;
  material: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}

const escapeHtml = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { record } = (await req.json()) as { record: RenovationRequest };
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      console.error("Missing RESEND_API_KEY or NOTIFICATION_EMAIL env vars");
      return new Response(
        JSON.stringify({ success: true, emailSent: false }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const scopeText = Array.isArray(record.scope)
      ? record.scope.join(", ")
      : record.scope;

    const createdAt = record.created_at
      ? new Date(record.created_at).toLocaleString("hr-HR", {
          timeZone: "Europe/Zagreb",
        })
      : new Date().toLocaleString("hr-HR", { timeZone: "Europe/Zagreb" });

    const accent = "#C84A2C";
    const adminUrl = "https://brick-renovacije.lovable.app/admin";

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;color:#333;width:180px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;color:#222;">${value}</td>
      </tr>`;

    const html = `
<!DOCTYPE html>
<html lang="hr">
<body style="margin:0;padding:24px;background:#f5f5f4;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1a1a1a;">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
    <div style="background:${accent};padding:20px 28px;">
      <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">Novi upit za renovaciju</h1>
      <p style="margin:4px 0 0;color:#ffffff;opacity:0.9;font-size:13px;">${escapeHtml(createdAt)}</p>
    </div>
    <div style="padding:24px 28px;">
      <h2 style="margin:0 0 12px;font-size:16px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:6px;">Klijent</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row("Ime", escapeHtml(record.name))}
        ${row("Email", `<a href="mailto:${escapeHtml(record.email)}" style="color:${accent};text-decoration:none;">${escapeHtml(record.email)}</a>`)}
        ${row("Telefon", record.phone ? `<a href="tel:${escapeHtml(record.phone)}" style="color:${accent};text-decoration:none;">${escapeHtml(record.phone)}</a>` : "—")}
      </table>

      <h2 style="margin:0 0 12px;font-size:16px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:6px;">Detalji projekta</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
        ${row("Tip nekretnine", escapeHtml(record.property_type))}
        ${row("Lokacija", escapeHtml(record.location))}
        ${row("Kvadratura", record.sqm ? `${escapeHtml(record.sqm)} m²` : "—")}
        ${row("Opseg radova", escapeHtml(scopeText))}
        ${row("Stanje nekretnine", escapeHtml(record.condition))}
        ${row("Materijali", escapeHtml(record.material))}
      </table>

      ${record.message ? `
      <h2 style="margin:0 0 12px;font-size:16px;color:${accent};border-bottom:2px solid ${accent};padding-bottom:6px;">Poruka klijenta</h2>
      <div style="background:#faf7f5;border-left:3px solid ${accent};padding:14px 16px;border-radius:4px;margin-bottom:24px;white-space:pre-wrap;">${escapeHtml(record.message)}</div>
      ` : ""}

      <div style="text-align:center;margin-top:24px;">
        <a href="${adminUrl}" style="display:inline-block;background:${accent};color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;">Otvori admin panel</a>
      </div>
    </div>
    <div style="background:#f5f5f4;padding:16px 28px;text-align:center;font-size:12px;color:#888;">
      Brick Renovacije — automatska obavijest
    </div>
  </div>
</body>
</html>`;

    const subject = `Novi upit za renovaciju — ${record.name}`;

    let emailSent = false;
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Brick Renovacije <onboarding@resend.dev>",
          to: [NOTIFICATION_EMAIL],
          subject,
          html,
          reply_to: record.email,
        }),
      });

      if (res.ok) {
        emailSent = true;
        console.log("Notification email sent for request", record.id);
      } else {
        const errText = await res.text();
        console.error("Resend API error:", res.status, errText);
      }
    } catch (err) {
      console.error("Failed to call Resend:", err);
    }

    return new Response(
      JSON.stringify({ success: true, emailSent }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Error processing notification:", error);
    return new Response(
      JSON.stringify({ success: true, emailSent: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
