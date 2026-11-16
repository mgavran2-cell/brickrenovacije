import type { Tables } from "@/integrations/supabase/types";

export type ProjectDocument = Tables<"project_documents">;
export const DOCUMENT_TYPES = ["ponuda", "aneks", "suglasnost", "ugovor", "racun", "ostalo"] as const;
export type DocumentType = typeof DOCUMENT_TYPES[number];
export const DOCUMENT_TYPE_LABELS: Record<string, string> = { ponuda: "Ponuda", aneks: "Aneks", suglasnost: "Suglasnost", ugovor: "Ugovor", racun: "Račun", ostalo: "Ostalo" };
export const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;
export const VAT_RATE = 0.25;
export const PENDING_STATUSES = ["poslano", "pregledano"];

export const hasAmount = (t: string) => t === "ponuda" || t === "aneks" || t === "racun";
export const hasValidUntil = (t: string) => t === "ponuda";
export const isPending = (status: string) => PENDING_STATUSES.includes(status);
export const withVat = (base: number) => Math.round(base * (1 + VAT_RATE) * 100) / 100;

export const validatePdf = (file: { type: string; size: number; name?: string }) => {
  if (file.type !== "application/pdf") return "Dopušteni su samo PDF dokumenti.";
  if (file.size <= 0) return "Datoteka je prazna.";
  if (file.size > MAX_DOCUMENT_BYTES) return "PDF može imati najviše 10 MB.";
  return null;
};

export const safeFileName = (name: string) => name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-").slice(-80) || "dokument.pdf";

export type DocumentAction = "send" | "remind" | "cancel" | "download" | "delete";
export const documentActions = (status: string): DocumentAction[] => {
  if (status === "draft") return ["send", "download", "delete"];
  if (isPending(status)) return ["remind", "cancel", "download"];
  return ["download"];
};

export const groupClientDocuments = (docs: ProjectDocument[]) => ({
  pending: docs.filter(d => isPending(d.status)),
  signed: docs.filter(d => d.status === "potpisano"),
  other: docs.filter(d => d.status === "odbijeno" || d.status === "otkazano"),
});
