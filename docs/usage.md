# Usage reference

Start with [getting started](getting-started.md) for a complete runnable bot. Public types and option definitions are in [dist/index.d.ts](../dist/index.d.ts).

## Nodes and sources

Each node accepts `identifier`, `host`, `port`, `password`, and `useSSL`. The host contains only the hostname or IP, without a URL scheme. Use `useSSL: true` for a TLS endpoint. Lavalink passwords must match the server configuration.

```js
const { SearchPlatform } = require("pulsify");
// Set this in Manager options:
// defaultSearchPlatform: SearchPlatform.SoundCloud
const result = await manager.search("song name", requester, ["soundcloud"]);
const player = manager.players.get(guildId);
```

The wrapper understands source names such as `soundcloud`, `deezer`, `spotify`, and `jiosaavn`. Availability depends on your node's installed plugins and configuration. Metadata support does not guarantee a playable stream; some providers require mirror sources or credentials. HTTP links are passed through to Lavalink.

## Player controls

Run controls inside your command handler and catch rejected promises. Check that the player and current track exist before using playback controls.

```js
await player.pause(true);
await player.pause(false);
await player.setVolume(50);
await player.seek(30_000); // milliseconds; track must support seeking
await player.stop();      // skip current track
await player.destroy();   // disconnect and remove player
```

`queue.current` is the current track. `queue.length` counts upcoming tracks; `queue.totalSize` includes the current track. `queue.clear()` removes upcoming tracks and does not stop the current one. To leave and remove the player, use `destroy()`.

```js
player.setTrackRepeat(true);
player.setQueueRepeat(true); // select the desired repeat mode
player.setAutoplay(true, client.user, 3);
player.setAutoplay(false);
```

Autoplay requires available recommendation sources. Configure `autoPlaySearchPlatforms` with values from the exported `AutoPlayPlatform` enum and enable corresponding sources on Lavalink.

## Events

| Event | Listener arguments | Purpose |
| --- | --- | --- |
| `nodeConnect` | `node` | Node connection established |
| `nodeError` | `node, error` | Node connection or message failure |
| `trackStart` | `player, track, payload` | Playback started |
| `trackEnd` | `player, track, payload` | Track ended |
| `trackError` | `player, track, payload` | Track exception |
| `queueEnd` | `player, track, payload` | Queue exhausted |

Event emitters do not await promises returned by your listeners. Catch errors inside asynchronous listeners, including Discord message sends.

## Session recovery

Enable `enableSessionResumeOption` on a node to request session resuming; `sessionTimeoutMs` controls the resume timeout. Recovery also depends on the server preserving its session and your bot's lifecycle. New installations store data under `pulsify/`. Upgrades reuse an existing `magmastream/` directory if no `pulsify/` directory exists. Keep the active data directory between restarts.

Pulsify registers SIGINT/SIGTERM handlers that save players during shutdown. Custom process managers and sharded bots should coordinate their shutdown lifecycle with these handlers.
