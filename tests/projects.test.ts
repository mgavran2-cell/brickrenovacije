import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { DEFAULT_PHASES, daysUntil, validateProject } from "../src/lib/projects";
describe("Project creation rules", () => {
  test("five default phases are ordered as requested", () => assert.deepEqual(DEFAULT_PHASES, ["Procjena", "Ugovor", "Priprema", "Izvođenje", "Predaja"]));
  test("manager is required", () => assert.notEqual(validateProject("Renovacija", "", "", "", "", [{name:"Procjena"}]), null));
  test("delivery cannot precede start", () => assert.notEqual(validateProject("Renovacija", "manager", "2026-11-02", "2026-11-01", "", [{name:"Procjena"}]), null));
  test("negative price is rejected", () => assert.notEqual(validateProject("Renovacija", "manager", "", "", "-1", [{name:"Procjena"}]), null));
  test("at least one phase is required", () => assert.notEqual(validateProject("Renovacija", "manager", "", "", "0", []), null));
  test("zero price and optional dates are accepted", () => assert.equal(validateProject("Renovacija", "manager", "", "", "0", [{name:"Procjena"}]), null));
  test("delivery days use calendar dates rather than partial days", () => assert.equal(daysUntil("2026-11-02", new Date(2026,9,30,23,59)), 3));
});
import { activeTasks, next7Days, phaseProgress, formatActivity } from "../src/lib/projects";
import type { ProjectTask } from "../src/lib/projects";

const task = (over: Partial<ProjectTask>): ProjectTask => ({
  id: "t1", project_id: "p1", phase_id: "f1", name: "Zadatak", description: null,
  status: "planirano", progress_percent: 0, assigned_to_user_id: null, assigned_to_text: null,
  start_date: null, due_date: null, completed_at: null, priority: "srednji",
  requires_client_presence: false, created_by: null, created_at: null, updated_at: null, ...over,
});

describe("Task rules", () => {
  test("phase progress is the rounded average of task progress", () =>
    assert.equal(phaseProgress([task({ progress_percent: 40 }), task({ id: "t2", progress_percent: 81 })], "f1"), 61));
  test("phase without tasks has zero progress", () => assert.equal(phaseProgress([], "f1"), 0));
  test("active tasks keep only u_tijeku and blokirano, u_tijeku first, max 5", () => {
    const list = [task({ status: "zavrseno" }), task({ id: "t2", status: "blokirano" }), task({ id: "t3", status: "u_tijeku" })];
    assert.deepEqual(activeTasks(list).map(t => t.status), ["u_tijeku", "blokirano"]);
  });
  test("next 7 days groups unfinished tasks by due date with Croatian day names", () => {
    const today = new Date(2026, 9, 30); // petak
    const week = next7Days([task({ due_date: "2026-10-31" }), task({ id: "t2", due_date: "2026-10-31", status: "zavrseno" })], today);
    assert.equal(week.length, 7);
    assert.equal(week[0].dayShort, "PET");
    assert.equal(week[1].dayShort, "SUB");
    assert.equal(week[1].tasks.length, 1);
  });
  test("activity messages are formatted in Croatian", () =>
    assert.equal(formatActivity({ id: "a1", project_id: "p1", actor_id: null, action: "task_completed", entity_type: "task", entity_id: "t1", metadata: { name: "Pločice" }, created_at: null }), "Zadatak „Pločice” završen"));
});
