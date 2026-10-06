import { mkdir, readdir, copyFile } from "node:fs/promises";
import { join } from "node:path";

const source = join(
  process.cwd(),
  "src",
  "infrastructure",
  "persistence",
  "migrations",
);

const target = join(
  process.cwd(),
  "dist",
  "src",
  "infrastructure",
  "persistence",
  "migrations",
);

await mkdir(target, { recursive: true });

const files = await readdir(source);

for (const file of files) {
  if (file.endsWith(".sql")) {
    await copyFile(join(source, file), join(target, file));
  }
}

console.log("Migrations copied successfully.");