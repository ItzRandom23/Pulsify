const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");
const pkg = require("../package.json");

test("release metadata and public exports", () => {
  assert.equal(pkg.name, "pulsify");
  assert.equal(pkg.version, "1.0.0");
  const api = require("../dist");
  for (const name of ["Manager", "Player", "Node", "Queue", "TrackUtils", "Filters"]) {
    assert.ok(api[name], `Missing export ${name}`);
  }
});

test("session data uses the new folder and preserves legacy installs", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "pulsify-release-"));
  const modulePath = require.resolve("../dist/utils/sessionData");
  const script = `console.log(require(${JSON.stringify(modulePath)}).dataRoot)`;
  const selected = () => execFileSync(process.execPath, ["-e", script], { cwd, encoding: "utf8" }).trim();
  try {
    assert.equal(selected(), path.join(cwd, "pulsify"));
    fs.mkdirSync(path.join(cwd, "magmastream"));
    assert.equal(selected(), path.join(cwd, "magmastream"));
    fs.mkdirSync(path.join(cwd, "pulsify"));
    assert.equal(selected(), path.join(cwd, "pulsify"));
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("websocket event failures reach the node error handler", { timeout: 5000 }, async () => {
  const { Node } = require("../dist");
  const { WebSocketServer } = require("ws");
  const server = new WebSocketServer({ port: 0, host: "127.0.0.1" });
  await new Promise(resolve => server.once("listening", resolve));
  const failure = new RangeError("No current track.");
  let report;
  const reported = new Promise(resolve => { report = resolve; });
  const node = Object.create(Node.prototype);
  Object.assign(node, {
    options: { host: "127.0.0.1", port: server.address().port, identifier: "test", password: "test" },
    manager: { options: { clientId: "test", clientName: "test" }, emit() {} },
    open() {}, close() {},
    async message() { throw failure; },
    error: report,
  });
  server.once("connection", socket => socket.send("test event"));
  try {
    node.connect();
    assert.equal(await reported, failure);
  } finally {
    node.socket?.terminate();
    for (const socket of server.clients) socket.terminate();
    await new Promise(resolve => server.close(resolve));
  }
});
