const fs = require("fs");
const path = require("path");

const manifestsDir = path.resolve("./manifests");

if (!fs.existsSync(manifestsDir)) {
  console.error("Manifests directory not found at ./manifests.");
  process.exit(1);
}

const manifestFiles = fs
  .readdirSync(manifestsDir)
  .filter((file) => file.endsWith(".json"))
  .sort();

if (manifestFiles.length === 0) {
  console.warn("No manifest files found in ./manifests.");
  process.exit(0);
}

let hasError = false;

manifestFiles.forEach((filename) => {
  const manifestPath = path.join(manifestsDir, filename);
  let entries;

  try {
    const manifestRaw = fs.readFileSync(manifestPath, "utf-8");
    entries = JSON.parse(manifestRaw);
  } catch (error) {
    console.error(`Failed to read or parse manifest ${filename}: ${error.message}`);
    hasError = true;
    return;
  }

  if (!Array.isArray(entries)) {
    console.error(`Manifest ${filename} must export an array of entries.`);
    hasError = true;
    return;
  }

  const siteName = path.basename(filename, ".json");
  const expectedPrefix = `sites/${siteName}/`;

  entries.forEach((entry, index) => {
    const context = `${filename} entry ${index + 1} (${entry.id ?? "<missing id>"})`;

    if (!entry.id || typeof entry.id !== "string" || entry.id.trim().length === 0) {
      console.error(`${context}: missing id.`);
      hasError = true;
    }

    if (!entry.alt || typeof entry.alt !== "string" || entry.alt.trim().length === 0) {
      console.error(`${context}: missing alt text.`);
      hasError = true;
    }

    if (typeof entry.path !== "string" || entry.path.trim().length === 0) {
      console.error(`${context}: missing path.`);
      hasError = true;
    }

    if (typeof entry.path === "string" && entry.path.trim().length > 0) {
      const normalizedPath = entry.path.trim();

      if (!normalizedPath.startsWith(expectedPrefix)) {
        console.error(
          `${context}: path must begin with "${expectedPrefix}" (received "${normalizedPath}").`
        );
        hasError = true;
      }

      const fileExtension = path.extname(normalizedPath).toLowerCase();
      if (fileExtension !== ".webp") {
        console.error(`${context}: expected a .webp file (received "${fileExtension || "<none>"}").`);
        hasError = true;
      }

      const filePath = path.resolve(normalizedPath);
      if (!fs.existsSync(filePath)) {
        console.error(`${context}: file not found at ${normalizedPath}.`);
        hasError = true;
      }
    }

    if (!Number.isFinite(entry.width) || entry.width <= 0) {
      console.error(`${context}: width must be a positive number.`);
      hasError = true;
    }

    if (!Number.isFinite(entry.height) || entry.height <= 0) {
      console.error(`${context}: height must be a positive number.`);
      hasError = true;
    }
  });
});

if (hasError) {
  console.error("\nImage manifest validation failed.");
  process.exit(1);
}

console.log("All image manifest entries are valid.");
