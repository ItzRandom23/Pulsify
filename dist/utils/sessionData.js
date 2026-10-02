"use strict";
const fs = require("fs");
const path = require("path");
const current = path.join(process.cwd(), "pulsify");
const legacy = path.join(process.cwd(), "magmastream");
// Reuse the previous data directory on upgrade without moving user files.
exports.dataRoot = fs.existsSync(current) || !fs.existsSync(legacy) ? current : legacy;
