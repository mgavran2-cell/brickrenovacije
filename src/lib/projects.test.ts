import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { DEFAULT_PHASES, daysUntil, validateProject } from "./projects";
describe("Project creation rules", () => {
  test("five default phases are ordered as requested", () => assert.deepEqual(DEFAULT_PHASES, ["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"]));
  test("manager is required", () => assert.notEqual(validateProject("Renovacija", "", "", "", "", [{name:"Procjena"}]), null));
  test("delivery cannot precede start", () => assert.notEqual(validateProject("Renovacija", "manager", "2026-11-02", "2026-11-01", "", [{name:"Procjena"}]), null));
  test("negative price is rejected", () => assert.notEqual(validateProject("Renovacija", "manager", "", "", "-1", [{name:"Procjena"}]), null));
  test("at least one phase is required", () => assert.notEqual(validateProject("Renovacija", "manager", "", "", "0", []), null));
  test("zero price and optional dates are accepted", () => assert.equal(validateProject("Renovacija", "manager", "", "", "0", [{name:"Procjena"}]), null));
  test("delivery days use calendar dates rather than partial days", () => assert.equal(daysUntil("2026-11-02", new Date(2026,9,30,23,59)), 3));
});