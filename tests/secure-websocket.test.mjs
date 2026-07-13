import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const ignoredDirectories = new Set([
  ".flow",
  ".git",
  ".next",
  ".wrangler",
  "dist",
  "node_modules",
]);
const inspectedExtensions = new Set([
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".ts",
  ".tsx",
  ".yaml",
  ".yml",
]);

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await sourceFiles(absolutePath)));
    } else if (entry.isFile() && inspectedExtensions.has(path.extname(entry.name))) {
      files.push(absolutePath);
    }
  }

  return files;
}

test("does not publish plaintext WebSocket endpoints", async () => {
  const insecureScheme = ["ws:", "//"].join("");
  const findings = [];

  for (const absolutePath of await sourceFiles(projectRoot)) {
    const content = await readFile(absolutePath, "utf8");
    if (content.includes(insecureScheme)) {
      findings.push(path.relative(projectRoot, absolutePath));
    }
  }

  assert.deepEqual(findings, [], `plaintext WebSocket scheme found in: ${findings.join(", ")}`);
});
