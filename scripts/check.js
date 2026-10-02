const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
function check(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) check(file);
    else if (file.endsWith(".js")) execFileSync(process.execPath, ["--check", file], { stdio: "inherit" });
  }
}
for (const directory of ["dist", "scripts", "test"]) {
  const fullPath = path.join(__dirname, "..", directory);
  if (fs.existsSync(fullPath)) check(fullPath);
}
console.log("Pulsify JavaScript syntax checks passed.");
