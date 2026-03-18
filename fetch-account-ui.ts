export {};

const repo = "keycloak/keycloak";

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
};

type GithubRelease = {
  tag_name: string;
  assets: ReleaseAsset[];
};

function parseVersionArg(): string {
  const arg = process.argv[2]?.trim();
  return arg && arg.length > 0 ? arg : "latest";
}

function hasVersionArg(): boolean {
  const arg = process.argv[2]?.trim();
  return !!arg;
}

async function getRelease(version: string): Promise<GithubRelease> {
  const releasePath =
    version === "latest" ? "releases/latest" : `releases/tags/${encodeURIComponent(version)}`;

  const res = await fetch(`https://api.github.com/repos/${repo}/${releasePath}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "bun-fetch-account-ui-script",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch release '${version}': ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as GithubRelease;
}

function getAccountUiAsset(release: GithubRelease): ReleaseAsset | undefined {
  return release.assets.find(
    (a) => a.name.startsWith("keycloak-account-ui") && a.name.endsWith(".tgz"),
  );
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

async function extractTgz(archivePath: string, outputDir: string) {
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
    cmd: ["tar", "-xzf", archivePath, "-C", outputDir],
    stdout: "inherit",
    stderr: "inherit",
  });

  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    throw new Error(`Failed to extract archive: tar exited with code ${exitCode}`);
  }
}

const requestedVersion = parseVersionArg();
const release = await getRelease(requestedVersion);

if (!hasVersionArg()) {
  console.log(release.tag_name);
  process.exit(0);
}

const asset = getAccountUiAsset(release);

if (!asset) {
  throw new Error(`No keycloak-account-ui .tgz asset found for release '${release.tag_name}'.`);
}

const normalizedTag = normalizeTagForPath(release.tag_name);
const archivePath = `keycloak-account-ui-${normalizedTag}.tgz`;
const outputDir = `keycloak-account-ui-extracted-${normalizedTag}`;

console.log(`Resolved release: ${release.tag_name}`);
console.log(`Asset URL: ${asset.browser_download_url}`);

await downloadFile(asset.browser_download_url, archivePath);
console.log(`Downloaded ${archivePath}`);

await extractTgz(archivePath, outputDir);
console.log(`Extracted ${archivePath} to ${outputDir}`);

console.log("Done.");
