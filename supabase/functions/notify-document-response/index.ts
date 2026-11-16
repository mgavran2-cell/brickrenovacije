import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
const APP_URL = "https://brickrenovacije.lovable.app";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const shell = (tag: string, inner: string) => `<html lang="hr"><body style="margin:0;background:#f4f1ee;font-family:Georgia,serif;color:#1f1f1f;padding:24px"><div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden"><div style="background:#B14625;padding:20px 32px"><table width="100%"><tr><td style="font-size:22px;color:#fff">brick.hr</td><td style="text-align:right;font-size:12px;letter-spacing:2px;color:#fff">${tag}</td></tr></table></div><div style="padding:32px;font-size:16px;line-height:1.6">${inner}</div></div></body></html>`;

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false }, 405);
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return json({ success: false }, 401);
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const client = createClient(url, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await client.auth.getUser();
    if (!user) return json({ success: false }, 401);
    const body = await req.json().catch(() => ({}));
    if (typeof body?.document_id !== "string" || !UUID.test(body.document_id)) return json({ success: false, reason: "invalid_document" }, 400);
    // Read through the caller's permissions: only the owning client sees the document; status must already reflect the response.
    const { data: doc } = await client.from("project_documents").select("*").eq("id", body.document_id).maybeSingle();
    if (!doc || !["potpisano", "odbijeno"].includes(doc.status) || doc.signed_by_user_id && doc.signed_by_user_id !== user.id) return json({ success: false, reason: "not_found" }, 404);
    const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const { data: p } = await service.from("projects").select("id,title,client_id,client_name,client_email,project_manager_id").eq("id", doc.project_id).single();
    if (!p || p.client_id !== user.id) return json({ success: false, reason: "not_found" }, 404);
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ success: true, emailSent: false, reason: "missing_email_configuration" });
    const { data: pm } = p.project_manager_id ? await service.from("profiles").select("email").eq("id", p.project_manager_id).maybeSingle() : { data: null };
    const to = pm?.email || Deno.env.get("NOTIFICATION_EMAIL");
    const signed = doc.status === "potpisano";
    const send = (recipient: string, subject: string, html: string) => fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "Brick Renovacije <onboarding@resend.dev>", to: [recipient], subject, html }) });
    let emailSent = false;
    if (to) {
      const subject = `${signed ? "Potpisan" : "Zatražene izmjene"}: ${doc.document_number} - ${doc.title}`;
      const html = shell(signed ? "POTPISANO" : "IZMJENE", `<h1 style="font-weight:normal;font-size:28px;margin:0 0 20px">${esc(subject)}</h1>
<p><strong>Klijent:</strong> ${esc(p.client_name)}<br><strong>Projekt:</strong> ${esc(p.title)}<br><strong>Dokument:</strong> ${esc(doc.document_number)} — ${esc(doc.title)}<br><strong>Odgovor:</strong> ${signed ? `Potpisano (${esc(doc.signed_by_name)})` : "Zatražene izmjene"}</p>
${doc.client_comment ? `<p style="background:#f4f1ee;padding:16px;border-radius:8px"><strong>Komentar:</strong> ${esc(doc.client_comment)}</p>` : ""}
<p><a href="${APP_URL}/admin/projekti/${p.id}" style="color:#B14625">Otvori projekt u adminu</a></p>`);
      const r = await send(to, subject, html); emailSent = r.ok; if (!r.ok) console.warn("Staff email failed", r.status);
    }
    if (signed && p.client_email) {
      const when = new Date(doc.signed_at ?? Date.now()).toLocaleString("hr-HR", { timeZone: "Europe/Zagreb" });
      const r = await send(p.client_email, `Potvrda potpisa: ${doc.document_number} - ${doc.title}`, shell("POTVRDA", `<h1 style="font-weight:normal;font-size:28px;margin:0 0 20px">Hvala, dokument je potpisan</h1><p>Dokument <strong>${esc(doc.document_number)} — ${esc(doc.title)}</strong> potpisali ste ${esc(when)} kao ${esc(doc.signed_by_name)}.</p><p><a href="${APP_URL}/dashboard/dokumenti/${doc.id}" style="color:#B14625">Pogledajte dokument</a></p><p>Brick Renovacije</p>`));
      if (!r.ok) console.warn("Client copy failed", r.status);
    }
    return json({ success: true, emailSent });
  } catch (e) { console.error(e); return json({ success: false, reason: "request_failed" }, 500); }
});
