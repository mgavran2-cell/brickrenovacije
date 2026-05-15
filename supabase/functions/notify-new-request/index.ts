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
  budget?: string | number | null;
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

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const formatDateHr = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  const parts = new Intl.DateTimeFormat("hr-HR", {
    timeZone: "Europe/Zagreb",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}. ${get("hour")}:${get("minute")}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");

    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      console.warn("notify-new-request: missing RESEND_API_KEY or NOTIFICATION_EMAIL");
      return json({ success: false, emailSent: false, reason: "missing_env" });
    }

    const { record } = (await req.json()) as { record: RenovationRequest };
    if (!record) {
      return json({ success: false, emailSent: false, reason: "missing_record" });
    }

    const accent = "#C84A2C";
    const cardBg = "#F5F5F5";
    const scopeText = Array.isArray(record.scope)
      ? record.scope.join(", ")
      : record.scope;
    const createdAt = formatDateHr(record.created_at);

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:600;color:#444;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#1a1a1a;">${value}</td>
      </tr>`;

    const section = (title: string, rows: string) => `
      <div style="background:${cardBg};border-radius:8px;padding:16px 20px;margin-bottom:16px;">
        <h2 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:${accent};">${escapeHtml(title)}</h2>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>`;

    const contactRows =
      row("Ime", escapeHtml(record.name)) +
      row(
        "Email",
        `<a href="mailto:${escapeHtml(record.email)}" style="color:${accent};text-decoration:none;">${escapeHtml(record.email)}</a>`,
      ) +
      (record.phone
        ? row(
            "Telefon",
            `<a href="tel:${escapeHtml(record.phone)}" style="color:${accent};text-decoration:none;">${escapeHtml(record.phone)}</a>`,
          )
        : "");

    let propertyRows = row("Tip nekretnine", escapeHtml(record.property_type)) +
      row("Lokacija", escapeHtml(record.location));
    if (record.sqm) propertyRows += row("Kvadratura", `${escapeHtml(record.sqm)} m²`);

    const scopeRows = row("Opseg", escapeHtml(scopeText));

    let detailRows = "";
    if (record.condition && record.condition !== "N/A")
      detailRows += row("Stanje", escapeHtml(record.condition));
    if (record.material && record.material !== "N/A")
      detailRows += row("Materijali", escapeHtml(record.material));
    if (record.budget) detailRows += row("Budžet", escapeHtml(record.budget));

    const html = `<!DOCTYPE html>
<html lang="hr"><body style="margin:0;padding:24px;background:#fafafa;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">
    <div style="background:${accent};padding:20px 24px;">
      <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">Novi upit za renovaciju</h1>
      <p style="margin:4px 0 0;color:#fff;opacity:0.9;font-size:13px;">${escapeHtml(createdAt)}</p>
    </div>
    <div style="padding:24px;">
      ${section("Kontakt", contactRows)}
      ${section("Nekretnina", propertyRows)}
      ${section("Opseg radova", scopeRows)}
      ${detailRows ? section("Detalji", detailRows) : ""}
      ${record.message ? `
      <div style="background:${cardBg};border-left:3px solid ${accent};border-radius:8px;padding:16px 20px;margin-bottom:16px;">
        <h2 style="margin:0 0 8px;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;color:${accent};">Poruka</h2>
        <div style="white-space:pre-wrap;color:#1a1a1a;">${escapeHtml(record.message)}</div>
      </div>` : ""}
    </div>
    <div style="padding:16px 24px;text-align:center;font-size:12px;color:#888;border-top:1px solid #eee;">
      Ovo je automatska obavijest s brickrenovacije.hr
    </div>
  </div>
</body></html>`;

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
          subject: `Novi upit za renovaciju — ${record.name}`,
          html,
          reply_to: record.email,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("Resend error:", res.status, data);
        return json({ success: true, emailSent: false, resendError: data });
      }
      return json({ success: true, emailSent: true, emailId: data?.id });
    } catch (err) {
      console.error("Resend fetch failed:", err);
      return json({ success: true, emailSent: false, resendError: String(err) });
    }
  } catch (error) {
    console.error("notify-new-request error:", error);
    return json({ success: false, emailSent: false, reason: "exception" });
  }
});
