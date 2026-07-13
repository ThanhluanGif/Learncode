import fs from "node:fs/promises";
import assert from "node:assert/strict";

const BASE_URL = process.env.API_URL || "http://127.0.0.1:8787";

async function run() {
  console.log("Verifying contract against", BASE_URL);

  // 1. Check OpenAPI schema
  const contractMd = await fs.readFile(new URL("../flow/05-contract.md", import.meta.url), "utf8");
  const expectedEndpoints = [...contractMd.matchAll(/\|\s*(GET|POST)\s*\|\s*`(\/api\/[^`]+|\/[^`]+)`/g)].map(m => ({ method: m[1].toLowerCase(), path: m[2] }));
  
  const openapiRes = await fetch(`${BASE_URL}/openapi.json`);
  assert.equal(openapiRes.status, 200, "Failed to fetch openapi.json");
  const openapi = await openapiRes.json();
  
  for (const { method, path } of expectedEndpoints) {
    assert.ok(openapi.paths[path], `Path ${path} missing in openapi.json`);
    assert.ok(openapi.paths[path][method], `Method ${method} missing in ${path} in openapi.json`);
  }
  console.log(`✅ OpenAPI schema matches contract.md (${expectedEndpoints.length} endpoints)`);

  // 2. Test missing auth
  const authRequiredPaths = ["/api/me", "/api/library", "/api/learning", "/api/progress", "/api/pilot-feedback"];
  for (const path of authRequiredPaths) {
    const res = await fetch(`${BASE_URL}${path}`);
    assert.equal(res.status, 401, `Expected 401 for unauthenticated GET ${path}`);
  }
  console.log("✅ Missing auth returns 401");

  // 3. Test success flows with Auth
  const headers1 = { "oai-authenticated-user-email": "student1@example.com", "Content-Type": "application/json" };
  const headers2 = { "oai-authenticated-user-email": "student2@example.com", "Content-Type": "application/json" };

  // GET /api/me
  let res = await fetch(`${BASE_URL}/api/me`, { headers: headers1 });
  assert.equal(res.status, 200);
  let data = await res.json();
  assert.ok(data.learner.id);
  const learner1Id = data.learner.id;

  // GET /api/library
  res = await fetch(`${BASE_URL}/api/library`, { headers: headers1 });
  assert.equal(res.status, 200);
  data = await res.json();
  assert.ok(Array.isArray(data.problems));

  // POST /api/pilot-feedback Validation
  res = await fetch(`${BASE_URL}/api/pilot-feedback`, {
    method: "POST", headers: headers1,
    body: JSON.stringify({ role: "invalid", rating: 6, completedCycle: false, minutesSpent: 0 })
  });
  assert.equal(res.status, 400);

  // POST /api/pilot-feedback Success
  res = await fetch(`${BASE_URL}/api/pilot-feedback`, {
    method: "POST", headers: headers1,
    body: JSON.stringify({ role: "student", rating: 5, completedCycle: true, minutesSpent: 30 })
  });
  assert.equal(res.status, 201);

  // GET /api/pilot-feedback Aggregate
  res = await fetch(`${BASE_URL}/api/pilot-feedback`, { headers: headers1 });
  assert.equal(res.status, 200);
  data = await res.json();
  assert.ok(data.summary.participants > 0);

  // POST /api/learning - start session
  res = await fetch(`${BASE_URL}/api/learning`, {
    method: "POST", headers: headers1,
    body: JSON.stringify({ action: "start_session", targetMinutes: 30 })
  });
  assert.equal(res.status, 201);
  data = await res.json();
  const sessionId1 = data.session.id;

  // POST /api/learning - record attempt
  res = await fetch(`${BASE_URL}/api/learning`, {
    method: "POST", headers: headers1,
    body: JSON.stringify({ action: "record_attempt", sessionId: sessionId1, problemId: 1, status: "AC", score: 100, confidence: 5, timeSpentSeconds: 60, language: "C++" })
  });
  // problemId: 1 might not exist if DB is fresh, but if it exists it returns 201, else 404
  if (res.status === 404) {
    console.log("⚠️ problem 1 not found (maybe no seed data). Skipping attempt.");
  } else {
    assert.equal(res.status, 201);
  }

  // GET /api/learning
  res = await fetch(`${BASE_URL}/api/learning`, { headers: headers1 });
  assert.equal(res.status, 200);
  data = await res.json();
  assert.ok(Array.isArray(data.sessions));

  // GET /api/progress
  res = await fetch(`${BASE_URL}/api/progress`, { headers: headers1 });
  assert.equal(res.status, 200);
  data = await res.json();
  assert.ok(data.totals);

  // 4. Test ownership failure
  // student2 tries to update student1's session
  res = await fetch(`${BASE_URL}/api/learning`, {
    method: "POST", headers: headers2,
    body: JSON.stringify({ action: "set_status", sessionId: sessionId1, status: "completed" })
  });
  assert.equal(res.status, 404, "Expected 404 when updating someone else's session");

  console.log("✅ Ownership and business logic passed");

  console.log("✅ All contract tests passed!");
}

run().catch(e => {
  console.error("Test failed", e);
  process.exit(1);
});
