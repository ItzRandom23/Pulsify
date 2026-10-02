# Pulsify v1.0.0

Pulsify is the renamed Lavalink v4 wrapper maintained by ItzRandom23, continuing the Magmastream fork.

## Changes

- Package name: `pulsify`, version `1.0.0`.
- Updated client name, logging, package metadata, and documentation.
- Existing Manager, Player, Node, Queue, TrackUtils, and filter APIs are preserved.
- Rejected websocket event promises are reported through the node error handler.
- New installations use `pulsify/` for session data. Existing `magmastream/` data is reused automatically.
- Requires Node.js 22.19 or newer and discord.js 13 or 14.

## Install

Download `pulsify-1.0.0.tgz` from this release and run:

```sh
npm install ./pulsify-1.0.0.tgz
```

Or install directly from GitHub:

```sh
npm install github:ItzRandom23/Pulsify#v1.0.0
```

Update imports to `require("pulsify")` or `import { Manager } from "pulsify"`.

## Validation

JavaScript syntax checks and regression tests passed for public exports, session directory compatibility, and websocket rejection handling. The packed release was installed and checked separately.

This repository includes compiled JavaScript and TypeScript declarations; TypeScript source is not included. The existing Apache-2.0 license and attribution are retained. This GitHub release does not publish the package to the npm registry.
