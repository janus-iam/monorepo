export {};

const repo = "keycloak/keycloak";
const apiPackageJsonPath = "packages/api/package.json";

function parseVersionArg(): string {
  const arg = process.argv[2]?.trim();
  return arg && arg.length > 0 ? arg : "latest";
}

function hasVersionArg(): boolean {
  const arg = process.argv[2]?.trim();
  return !!arg;
}

function stripSemverRange(version: string): string {
  return version.trim().replace(/^[^0-9]*/, "");
}

async function getCurrentVersion(): Promise<string> {
  const file = Bun.file(apiPackageJsonPath);

  if (!(await file.exists())) {
    throw new Error(`Could not find ${apiPackageJsonPath}`);
  }

  const packageJson = (await file.json()) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const rawVersion =
    packageJson.dependencies?.["@keycloak/keycloak-admin-client"] ??
    packageJson.devDependencies?.["@keycloak/keycloak-admin-client"];

  if (!rawVersion) {
    throw new Error(
      `@keycloak/keycloak-admin-client was not found in dependencies/devDependencies of ${apiPackageJsonPath}`,
    );
  }

  const cleanedVersion = stripSemverRange(rawVersion);
  if (!cleanedVersion) {
    throw new Error(
      `Invalid @keycloak/keycloak-admin-client version '${rawVersion}' in ${apiPackageJsonPath}`,
    );
  }

  return cleanedVersion;
}

async function getLatestVersion(): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "bun-fetch-account-ui-script",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch latest release: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as { tag_name: string };
  return data.tag_name;
}

function normalizeTagForPath(tag: string): string {
  return tag.replace(/^v/, "").replace(/[^a-zA-Z0-9._-]/g, "_");
}

async function downloadFile(url: string, output: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to download file: ${res.status} ${res.statusText}`);
  }

  await Bun.write(output, res);
}

async function extractZip(archivePath: string, outputDir: string) {
  const mkdirProc = Bun.spawn({
    cmd: ["mkdir", "-p", outputDir],
    stdout: "ignore",
    stderr: "inherit",
  });

  const mkdirExitCode = await mkdirProc.exited;
  if (mkdirExitCode !== 0) {
    throw new Error(`Failed to create output directory: mkdir exited with code ${mkdirExitCode}`);
  }

  const proc = Bun.spawn({
    cmd: ["unzip", "-q", archivePath, "-d", outputDir],
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Failed to extract archive: unzip exited with code ${exitCode}`);
  }
}

async function copyDirectory(src: string, dest: string) {
  const mkdirProc = Bun.spawn({
    cmd: ["mkdir", "-p", dest],
    stdout: "ignore",
    stderr: "inherit",
  });

  const mkdirExitCode = await mkdirProc.exited;
  if (mkdirExitCode !== 0) {
    throw new Error(
      `Failed to create destination directory: mkdir exited with code ${mkdirExitCode}`,
    );
  }

  const proc = Bun.spawn({
    cmd: ["cp", "-r", src, dest],
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Failed to copy directory: cp exited with code ${exitCode}`);
  }
}

async function deletePath(path: string) {
  const proc = Bun.spawn({
    cmd: ["rm", "-rf", path],
    stdout: "ignore",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Failed to delete path '${path}': rm exited with code ${exitCode}`);
  }
}

const requestedVersion = parseVersionArg();
let resolvedVersion = requestedVersion;

if (requestedVersion === "latest") {
  resolvedVersion = await getLatestVersion();
  console.log(`Resolved latest release: ${resolvedVersion}`);
}

if (requestedVersion === "current") {
  resolvedVersion = await getCurrentVersion();
  console.log(resolvedVersion);
  process.exit(0);
}

if (!hasVersionArg()) {
  console.log(resolvedVersion);
  process.exit(0);
}

const normalizedTag = normalizeTagForPath(resolvedVersion);
const archivePath = `keycloak-${normalizedTag}.zip`;
const tempDir = `keycloak-${normalizedTag}-temp`;
const outputDir = `keycloak-account-ui-${normalizedTag}`;

const downloadUrl = `https://github.com/${repo}/archive/refs/tags/${resolvedVersion}.zip`;

console.log(`Downloading source code from: ${downloadUrl}`);
try {
  await downloadFile(downloadUrl, archivePath);
  console.log(`Downloaded ${archivePath}`);

  await extractZip(archivePath, tempDir);
  console.log(`Extracted ${archivePath} to ${tempDir}`);

  const extractedDir = `${tempDir}/keycloak-${resolvedVersion.replace(/^v/, "")}`;
  const accountUiSrc = `${extractedDir}/js/apps/account-ui`;

  await copyDirectory(accountUiSrc, outputDir);
  console.log(`Copied account-ui from ${accountUiSrc} to ${outputDir}`);
} finally {
  await deletePath(tempDir);
  await deletePath(archivePath);
  console.log(`Deleted temporary artifacts: ${tempDir}, ${archivePath}`);
}

console.log("Done.");
