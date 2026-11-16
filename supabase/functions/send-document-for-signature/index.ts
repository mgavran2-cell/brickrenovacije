import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const esc = (v: unknown) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c));
const APP_URL = "https://brickrenovacije.lovable.app";
const TYPES: Record<string, string> = { ponuda: "Ponuda", aneks: "Aneks", suglasnost: "Suglasnost", ugovor: "Ugovor", racun: "Račun", ostalo: "Dokument" };
const date = (d: string | null) => d ? new Date(d).toLocaleDateString("hr-HR", { day: "numeric", month: "long", year: "numeric" }) : "—";
const money = (n: number | null) => n == null ? "—" : `${new Intl.NumberFormat("hr-HR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} €`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async req => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false }, 405);
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) return json({ success: false, reason: "unauthorized" }, 401);
    const url = Deno.env.get("SUPABASE_URL") ?? "";
    const client = createClient(url, Deno.env.get("SUPABASE_ANON_KEY") ?? "", { global: { headers: { Authorization: authorization } } });
    const { data: { user } } = await client.auth.getUser();
    if (!user) return json({ success: false, reason: "unauthorized" }, 401);
    const [a, m] = await Promise.all([client.rpc("has_role", { _user_id: user.id, _role: "admin" }), client.rpc("has_role", { _user_id: user.id, _role: "moderator" })]);
    if (a.data !== true && m.data !== true) return json({ success: false, reason: "forbidden" }, 403);
    const body = await req.json().catch(() => ({}));
    const documentId = body?.document_id;
    const reminder = body?.reminder === true;
    if (typeof documentId !== "string" || !UUID.test(documentId)) return json({ success: false, reason: "invalid_document" }, 400);
    const { data: doc } = await client.from("project_documents").select("*").eq("id", documentId).maybeSingle();
    if (!doc) return json({ success: false, reason: "not_found" }, 404);
    if (!["draft", "poslano", "pregledano"].includes(doc.status)) return json({ success: false, reason: "invalid_status" }, 409);
    const { data: p } = await client.from("projects").select("id,title,client_name,client_email,is_draft").eq("id", doc.project_id).single();
    if (!p || p.is_draft) return json({ success: false, reason: "project_draft" }, 409);
    if (doc.status === "draft") {
      const { error } = await client.from("project_documents").update({ status: "poslano", sent_at: new Date().toISOString() }).eq("id", doc.id);
      if (error) return json({ success: false, reason: "update_failed" }, 500);
    }
    await client.from("project_activity_log").insert({ project_id: p.id, actor_id: user.id, action: reminder ? "document_reminder_sent" : "document_sent", entity_type: "document", entity_id: doc.id, metadata: { number: doc.document_number, title: doc.title } });
    const key = Deno.env.get("RESEND_API_KEY");
    if (!p.client_email) return json({ success: true, emailSent: false, reason: "missing_client_email" });
    if (!key) return json({ success: true, emailSent: false, reason: "missing_email_configuration" });
    const service = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "");
    const signed = await service.storage.from("project-documents").createSignedUrl(doc.storage_path, 60 * 60 * 24);
    const link = `${APP_URL}/dashboard/dokumenti/${doc.id}`;
    const row = (l: string, v: string) => `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#777">${l}</td><td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right">${esc(v)}</td></tr>`;
    const html = `<html lang="hr"><body style="margin:0;background:#f4f1ee;font-family:Georgia,serif;color:#1f1f1f;padding:24px"><div style="max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
<div style="background:#B14625;color:#fff;padding:20px 32px;display:flex"><table width="100%"><tr><td style="font-size:22px;color:#fff">brick.hr</td><td style="text-align:right;font-size:12px;letter-spacing:2px;color:#fff">DOKUMENT</td></tr></table></div>
<div style="padding:32px"><p style="font-size:12px;letter-spacing:2px;color:#B14625;margin:0 0 12px">${reminder ? "PODSJETNIK · " : ""}POTREBAN POTPIS</p>
<h1 style="font-weight:normal;font-size:30px;margin:0 0 16px">${esc(doc.title)} čeka vaš potpis</h1>
<p style="font-size:16px;line-height:1.6;color:#555">Poštovani/a ${esc(p.client_name)},</p>${doc.description ? `<p style="font-size:16px;line-height:1.6;color:#555">${esc(doc.description)}</p>` : ""}
<table width="100%" style="border-collapse:collapse;font-size:15px;margin:24px 0">${row("Broj dokumenta", doc.document_number)}${row("Tip", TYPES[doc.document_type] ?? doc.document_type)}${row("Iznos (bez PDV-a)", money(doc.total_amount))}${row("Vrijedi do", date(doc.valid_until))}${row("Rok potpisa", date(doc.due_date))}</table>
<p style="text-align:center;margin:32px 0"><a href="${link}" style="background:#B14625;color:#fff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:16px">Pregledaj i potpiši</a></p>
${signed.data?.signedUrl ? `<p style="text-align:center;font-size:14px"><a href="${signed.data.signedUrl}" style="color:#B14625">Preuzmi PDF</a> <span style="color:#999">(link vrijedi 24 sata)</span></p>` : ""}
<p style="font-size:15px;line-height:1.6;color:#555">Ne morate odmah. Slobodno nazovite ako imate pitanja: <a href="tel:+385998358317" style="color:#B14625">099 835 8317</a></p>
<p style="font-size:15px;color:#555">Brick Renovacije</p></div></div></body></html>`;
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "Brick Renovacije <onboarding@resend.dev>", to: [p.client_email], subject: `${reminder ? "Podsjetnik: " : ""}${doc.title} čeka vaš potpis`, html }) });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) { console.warn("Document email failed", res.status, result); return json({ success: true, emailSent: false, reason: "delivery_failed" }); }
    return json({ success: true, emailSent: true, emailId: result.id });
  } catch (e) { console.error(e); return json({ success: false, reason: "request_failed" }, 500); }
});
