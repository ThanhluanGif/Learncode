import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";
import {
  AuthRequiredError,
  readAuthenticatedIdentity,
  resolveLearner,
} from "../lib/auth/identity.ts";
import { documentedInterfaces, openApiDocument } from "../lib/api/openapi.ts";

function memoryLearnerStore() {
  const learners = new Map();
  return {
    async findByEmail(email) {
      return learners.get(email) ?? null;
    },
    async create({ email, displayName }) {
      const learner = {
        id: learners.size + 1,
        displayName,
        division: "B",
        schoolLevel: "THCS",
        xp: 0,
        createdAt: "2026-07-13T00:00:00.000Z",
      };
      learners.set(email, learner);
      return learner;
    },
  };
}

function identityHeaders(email, fullName) {
  const headers = new Headers({ "oai-authenticated-user-email": email });
  if (fullName) {
    headers.set("oai-authenticated-user-full-name", encodeURIComponent(fullName));
    headers.set("oai-authenticated-user-full-name-encoding", "percent-encoded-utf-8");
  }
  return headers;
}

test("requires platform identity and normalizes the forwarded email", async () => {
  assert.equal(readAuthenticatedIdentity(new Headers()), null);
  const identity = readAuthenticatedIdentity(identityHeaders(" HOCSINH@Example.COM ", "Nguyễn An"));
  assert.deepEqual(identity, { email: "hocsinh@example.com", displayName: "Nguyễn An" });
  await assert.rejects(resolveLearner(new Headers(), memoryLearnerStore()), AuthRequiredError);
});

test("resolves two identities to two learners without accepting a client learner id", async () => {
  const store = memoryLearnerStore();
  const first = await resolveLearner(identityHeaders("an@example.com", "An"), store);
  const second = await resolveLearner(identityHeaders("binh@example.com", "Bình"), store);
  const sameFirst = await resolveLearner(identityHeaders("AN@example.com", "Tên bị bỏ qua"), store);

  assert.notEqual(first.id, second.id);
  assert.equal(sameFirst.id, first.id);
  assert.equal(sameFirst.displayName, "An");
});

test("serves every planned interface in the OpenAPI document", () => {
  assert.equal(openApiDocument.openapi, "3.1.0");
  assert.equal(documentedInterfaces.length, 10);
  for (const [method, path] of documentedInterfaces) {
    assert.ok(path in openApiDocument.paths, `missing path ${path}`);
    const operation = openApiDocument.paths[path][method.toLowerCase()];
    assert.ok(operation, `missing operation ${method} ${path}`);
    assert.ok(operation.responses, `missing responses for ${method} ${path}`);
  }
  assert.doesNotMatch(JSON.stringify(openApiDocument), /FILL|TODO/);
});

test("keeps a versioned migration for the learner identity key", async () => {
  const migrationRoot = new URL("../.openai/drizzle/", import.meta.url);
  const files = (await readdir(migrationRoot)).filter((file) => file.endsWith(".sql")).sort();
  assert.equal(files.length, 2, "expected baseline and identity migrations");
  const [baseline, identity] = await Promise.all(files.map((file) => readFile(new URL(file, migrationRoot), "utf8")));
  assert.match(baseline, /CREATE TABLE IF NOT EXISTS `learners`/);
  assert.match(identity, /ALTER TABLE `learners` ADD `email` text/);
  assert.match(identity, /learners_email_unique/);
});
