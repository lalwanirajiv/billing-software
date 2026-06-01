import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const tauriConfPath = join(root, "src-tauri/tauri.conf.json");
const packagePath = join(root, "package.json");
const cargoPath = join(root, "src-tauri/Cargo.toml");

function readTauriVersion() {
  return JSON.parse(readFileSync(tauriConfPath, "utf8")).version;
}

function writeTauriVersion(version) {
  const config = JSON.parse(readFileSync(tauriConfPath, "utf8"));
  config.version = version;
  writeFileSync(tauriConfPath, `${JSON.stringify(config, null, 2)}\n`);
}

function writePackageVersion(version) {
  const pkg = JSON.parse(readFileSync(packagePath, "utf8"));
  pkg.version = version;
  writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`);
}

function writeCargoVersion(version) {
  let cargo = readFileSync(cargoPath, "utf8");
  cargo = cargo.replace(/^version = ".*"/m, `version = "${version}"`);
  writeFileSync(cargoPath, cargo);
}

const argVersion = process.argv[2];
const version = argVersion ?? readTauriVersion();

if (!/^\d+\.\d+\.\d+(-[\w.-]+)?$/.test(version)) {
  console.error(`Invalid semver: ${version}`);
  console.error("Usage: node scripts/set-version.mjs [x.y.z]");
  process.exit(1);
}

writeTauriVersion(version);
writePackageVersion(version);
writeCargoVersion(version);

console.log(`Version set to ${version} across tauri.conf.json, package.json, and Cargo.toml`);
