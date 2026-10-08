const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContractorApplication {
  name: string;
  profession: string;
  experience: string;
  legal_form: string;
  location: string;
  phone: string;
  email: string;
  about?: string | null;
  created_at?: string;
}

const escapeHtml = (s: unknown): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const json = (body: unknown) =>
  new Response(JSON.stringify(body), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const formatDateHr = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date();
  const parts = new Intl.DateTimeFormat("hr-HR", {
    timeZone: "Europe/Zagreb", day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}. ${get("hour")}:${get("minute")}`;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const NOTIFICATION_EMAIL = Deno.env.get("NOTIFICATION_EMAIL");
    if (!RESEND_API_KEY || !NOTIFICATION_EMAIL) {
      console.warn("notify-new-contractor: missing env");
      return json({ success: false, emailSent: false, reason: "missing_env" });
    }

    const { record } = (await req.json()) as { record: ContractorApplication };
    if (!record) return json({ success: false, emailSent: false, reason: "missing_record" });

    const accent = "#C84A2C";
    const row = (label: string, value: string) => `
      <tr><td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;font-weight:600;color:#444;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;color:#222;">${value}</td></tr>`;
    const section = (title: string, rows: string) => `
      <div style="background:#F5F5F5;border-radius:8px;padding:16px 20px;margin-bottom:16px;">
        <h2 style="margin:0 0 12px;font-size:16px;color:${accent};">${escapeHtml(title)}</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
      </div>`;

    const email = escapeHtml(record.email);
    const phone = escapeHtml(record.phone);
    const html = `
      <div style="max-width:600px;margin:0 auto;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:24px;color:#222;">
        <h1 style="margin:0 0 4px;font-size:22px;color:${accent};">Nova prijava izvođača</h1>
        <p style="margin:0 0 20px;color:#666;font-size:13px;">Primljeno: ${formatDateHr(record.created_at)}</p>
        ${section("Osobni podaci",
          row("Ime", escapeHtml(record.name)) +
          row("Email", `<a href="mailto:${email}" style="color:${accent};">${email}</a>`) +
          row("Telefon", `<a href="tel:${phone}" style="color:${accent};">${phone}</a>`))}
        ${section("Profesionalni podaci",
          row("Zanimanje", escapeHtml(record.profession)) +
          row("Iskustvo", escapeHtml(record.experience) + " god.") +
          row("Pravni oblik", escapeHtml(record.legal_form)) +
          row("Lokacija", escapeHtml(record.location)))}
        ${record.about ? `<div style="background:#F5F5F5;border-radius:8px;padding:16px 20px;margin-bottom:16px;">
          <h2 style="margin:0 0 12px;font-size:16px;color:${accent};">O sebi</h2>
          <p style="margin:0;font-size:14px;white-space:pre-wrap;">${escapeHtml(record.about)}</p></div>` : ""}
        <p style="margin-top:24px;font-size:12px;color:#999;text-align:center;">Ovo je automatska obavijest s brickrenovacije.hr</p>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Brick Renovacije <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: `Nova prijava izvođača — ${record.name} (${record.profession})`,
        html,
      }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("Resend error", res.status, data);
      return json({ success: true, emailSent: false, resendError: data });
    }
    return json({ success: true, emailSent: true, emailId: data?.id });
  } catch (err) {
    console.error("notify-new-contractor error", err);
    return json({ success: true, emailSent: false, error: String(err) });
  }
});
