import { describe, test, expect } from "bun:test";
import { DEFAULT_PHASES, daysUntil, validateProject } from "./projects";
describe("Project creation rules", () => {
  test("five default phases are ordered as requested", () => expect(DEFAULT_PHASES).toEqual(["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"]));
  test("manager is required", () => expect(validateProject("Renovacija", "", "", "", "", [{name:"Procjena"}])).not.toBeNull());
  test("delivery cannot precede start", () => expect(validateProject("Renovacija", "manager", "2026-11-02", "2026-11-01", "", [{name:"Procjena"}])).not.toBeNull());
  test("negative price is rejected", () => expect(validateProject("Renovacija", "manager", "", "", "-1", [{name:"Procjena"}])).not.toBeNull());
  test("at least one phase is required", () => expect(validateProject("Renovacija", "manager", "", "", "0", [])).not.toBeNull());
  test("zero price and optional dates are accepted", () => expect(validateProject("Renovacija", "manager", "", "", "0", [{name:"Procjena"}])).toBeNull());
  test("delivery days use calendar dates rather than partial days", () => expect(daysUntil("2026-11-02", new Date(2026,9,30,23,59))).toBe(3));
});