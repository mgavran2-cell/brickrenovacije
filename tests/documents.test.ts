import { describe, expect, test } from "bun:test";
import { documentActions, groupClientDocuments, hasAmount, hasValidUntil, validatePdf, withVat } from "../src/lib/documents";
describe("Document rules", () => {
  test("PDF only, max 10 MB", () => {
    expect(validatePdf({ type: "application/pdf", size: 10485760 })).toBeNull();
    expect(validatePdf({ type: "application/pdf", size: 10485761 })).not.toBeNull();
    expect(validatePdf({ type: "image/png", size: 100 })).not.toBeNull();
  });
  test("amount only for ponuda/aneks/racun, valid-until only for ponuda", () => {
    expect([hasAmount("ponuda"), hasAmount("aneks"), hasAmount("racun"), hasAmount("ugovor"), hasAmount("suglasnost")]).toEqual([true, true, true, false, false]);
    expect([hasValidUntil("ponuda"), hasValidUntil("aneks")]).toEqual([true, false]);
  });
  test("total with 25% VAT", () => { expect(withVat(10000)).toBe(12500); expect(withVat(99.99)).toBe(124.99); });
  test("status workflow actions", () => {
    expect(documentActions("draft")).toEqual(["send", "download", "delete"]);
    expect(documentActions("poslano")).toEqual(["remind", "cancel", "download"]);
    expect(documentActions("pregledano")).toEqual(["remind", "cancel", "download"]);
    expect(documentActions("potpisano")).toEqual(["download"]);
  });
  test("client grouping", () => {
    const d = (status: string) => ({ status }) as never;
    const g = groupClientDocuments([d("poslano"), d("pregledano"), d("potpisano"), d("odbijeno"), d("otkazano")]);
    expect([g.pending.length, g.signed.length, g.other.length]).toEqual([2, 1, 2]);
  });
});
