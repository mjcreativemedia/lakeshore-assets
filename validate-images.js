const fs = require("fs");
const path = require("path");

const manifestPath = path.resolve("./images.json");
const manifestRaw = fs.readFileSync(manifestPath, "utf-8");
const manifest = JSON.parse(manifestRaw);

let hasError = false;

manifest.forEach((entry, index) => {
  const context = `Entry ${index + 1} (${entry.id ?? "<missing id>"})`;

  if (!entry.alt || typeof entry.alt !== "string" || entry.alt.trim().length === 0) {
    console.error(`${context}: missing alt text.`);
    hasError = true;
  }

  if (typeof entry.width !== "number") {
    console.error(`${context}: width must be provided as a number.`);
    hasError = true;
  }

  if (typeof entry.height !== "number") {
    console.error(`${context}: height must be provided as a number.`);
    hasError = true;
  }

  if (!entry.path || typeof entry.path !== "string") {
    console.error(`${context}: missing path.`);
    hasError = true;
    return;
  }

  const filePath = path.resolve(entry.path);
  if (!fs.existsSync(filePath)) {
    console.error(`${context}: file not found at ${entry.path}.`);
    hasError = true;
  }
});

if (hasError) {
  console.error("\nImage manifest validation failed.");
  process.exit(1);
}

console.log("All image manifest entries are valid.");
