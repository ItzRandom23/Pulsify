# Pulsify

Pulsify is a Lavalink v4 wrapper for Node.js and Discord music bots, maintained by ItzRandom23.

## Installation

Requires Node.js 22.19 or newer and discord.js 13 or 14.

Install the GitHub v1.0.0 release after the repository is renamed:

```sh
npm install github:ItzRandom23/Pulsify#v1.0.0
```

You can also install the release asset:

```sh
npm install ./pulsify-1.0.0.tgz
```

## Usage

```js
const { Manager, LoadTypes, StateTypes } = require("pulsify");
```

The exported Manager, Player, Node, Queue, TrackUtils, and filter APIs are preserved. Configure the manager with your Lavalink nodes and Discord voice packet sender as before.

## Upgrading from Magmastream

- Replace the `magmastream` dependency with `pulsify`.
- Change imports from `require("magmastream")` to `require("pulsify")`, or the equivalent ES module import.
- Existing `magmastream/` session data is reused automatically. New installations store session data in `pulsify/`. If both directories exist, Pulsify uses `pulsify/`.
- Keep your existing bot playback coordinator and queue safeguards. Those bot-level fixes are separate from the wrapper.

## Development

This repository currently distributes checked-in JavaScript in `dist/` and TypeScript declarations in `dist/index.d.ts`; TypeScript source is not included. `npm run build` validates the checked-in JavaScript rather than compiling unavailable source.

```sh
npm ci
npm run ci
npm pack
```

## Credits and license

Pulsify is derived from Magmastream, with customizations maintained by [ItzRandom23](https://github.com/ItzRandom23). Credit to the original Magmastream team. Distributed under the existing Apache-2.0 license; see [LICENSE](LICENSE).
