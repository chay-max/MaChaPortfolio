import { test } from "node:test";
import assert from "node:assert/strict";
import {
  allowedOwner,
  safeUrl,
  imageUrl,
  projectSchema,
} from "../src/lib/validation";
test("owner authorization fails closed without owner configuration", () => {
  assert.equal(allowedOwner("attacker", undefined), false);
  assert.equal(allowedOwner("attacker", "owner"), false);
  assert.equal(allowedOwner("owner", "owner"), true);
});
test("stored links reject script, relative and data protocols", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,test",
    "//evil.example",
    "http://example.com",
  ])
    assert.equal(safeUrl.safeParse(url).success, false);
  assert.equal(safeUrl.safeParse("https://github.com/chay-max").success, true);
  assert.equal(safeUrl.safeParse("").success, true);
});
test("images reject unsafe protocols and traversal", () => {
  for (const url of [
    "javascript:test",
    "/images/../secret",
    "//evil.test",
    "data:image/svg+xml,hello",
  ])
    assert.equal(imageUrl.safeParse(url).success, false);
  assert.equal(imageUrl.safeParse("/images/portrait-demo.png").success, true);
});
test("projects reject invalid slugs and arbitrary publication states", () => {
  const p = {
    slug: "valid-project",
    title: "Project",
    summary: "A useful project",
    description: "",
    role: "Developer",
    year: 2026,
    tags: ["React"],
    cover_url: "/images/mbg-concept.png",
    cover_is_concept: true,
    live_url: "",
    source_url: "",
    status: "draft",
    sort_order: 0,
  };
  assert.equal(projectSchema.safeParse(p).success, true);
  assert.equal(
    projectSchema.safeParse({ ...p, slug: "../dashboard" }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({ ...p, status: "admin" }).success,
    false,
  );
});
