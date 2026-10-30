import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
const escape = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ emailSent: false }, 405);
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return json({ emailSent: false }, 401);
    const client = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error } = await client.auth.getUser();
    if (error || !user) return json({ emailSent: false }, 401);
    const [admin, moderator] = await Promise.all([client.rpc("has_role", { _user_id: user.id, _role: "admin" }), client.rpc("has_role", { _user_id: user.id, _role: "moderator" })]);
    if (admin.data !== true && moderator.data !== true) return json({ emailSent: false }, 403);
    const { projectId } = await req.json();
    const { data: p, error: projectError } = await client.from("projects").select("id,title,client_name,client_email,status,end_date,is_draft").eq("id", projectId).single();
    if (projectError || !p || p.is_draft || !p.client_email) return json({ success: false, emailSent: false, reason: "project_unavailable" });
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ success: true, emailSent: false, reason: "missing_email_configuration" });
    const labels: Record<string, string> = { procjena: "Procjena", ugovor: "Ugovor", priprema: "Priprema", izvodenje: "Izvođenje", predaja: "Predaja", zavrseno: "Završeno", odbijeno: "Odbijeno" };
    const date = p.end_date ? new Date(p.end_date).toLocaleDateString("hr-HR") : "Još nije dogovorena";
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": `project-created-${p.id}` }, body: JSON.stringify({ from: "Brick Renovacije <onboarding@resend.dev>", to: [p.client_email], subject: `Vaš projekt je kreiran — ${p.title}`, html: `<html lang="hr"><body style="font-family:Arial,sans-serif;background:#f5f5f5;color:#1a1a1a;padding:24px"><main style="max-width:600px;margin:auto;background:#fff;padding:32px;border-top:4px solid #C84A2C"><h1 style="color:#C84A2C">Vaš projekt je kreiran</h1><p>Pozdrav ${escape(p.client_name)},</p><p>Vaš projekt „${escape(p.title)}” je kreiran.</p><p>Status: ${escape(labels[p.status] ?? p.status)}</p><p>Očekivana predaja: ${escape(date)}</p><p><a href="https://brickrenovacije.lovable.app/dashboard" style="color:#C84A2C">Pratite napredak projekta</a></p><p>Brick Renovacije</p></main></body></html>` }) });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) { console.warn("Project email delivery failed", res.status); return json({ success: true, emailSent: false, reason: "delivery_failed" }); }
    return json({ success: true, emailSent: true, emailId: result.id });
  } catch { return json({ success: false, emailSent: false, reason: "request_failed" }); }
});