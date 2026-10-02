# Build your first music bot with Pulsify

Pulsify connects your Discord bot to Lavalink. Your bot handles commands and voice gateway packets; Lavalink loads tracks and streams audio. Pulsify manages the connection, players, and queues between them.

## 1. Prepare the tools

You need Node.js 22.19 or newer, a Discord bot token, and a working Lavalink v4 server. Pulsify supports discord.js 13 and 14; the example uses version 14. Obtain the server release and Java requirements from [Lavalink's installation guide](https://lavalink.dev/getting-started/index.html).

For a local Lavalink server, create `application.yml` beside `Lavalink.jar`:

```yaml
server:
  port: 2333
  address: 127.0.0.1
lavalink:
  server:
    password: "change-this-password"
    sources:
      youtube: false
      soundcloud: true
    soundcloudSearchEnabled: true
```

Start it with `java -jar Lavalink.jar`. Use the same password in the bot configuration. This local example uses Lavalink's SoundCloud source; Pulsify does not install server plugins. For PulseLink or other source plugins, follow their configuration instructions and avoid registering competing handlers for the same source. See the [official Lavalink configuration reference](https://lavalink.dev/configuration/config/file).

## 2. Configure Discord

Create an application and bot in the [Discord Developer Portal](https://discord.com/developers/applications). On its Bot page, enable **Message Content Intent**, because this example reads prefix commands. Invite the bot to your test server with View Channel, Send Messages, Connect, and Speak permissions. Ensure those permissions also apply to the text and voice channels you use.

The example requests Guilds, GuildVoiceStates, GuildMessages, and MessageContent intents. Voice state events are required to establish playback. Learn more in the [discord.js intents guide](https://discordjs.guide/legacy/popular-topics/intents).

## 3. Install Pulsify

In a new bot directory:

```sh
npm init -y
npm install discord.js@14 github:ItzRandom23/Pulsify#v1.0.0
```

Download or copy [the complete example](../examples/basic-bot/index.js) as `index.js`, and [.env.example](../examples/basic-bot/.env.example) as `.env`. Enter your bot token and Lavalink settings. Keep `.env` out of version control by adding it to your bot project's `.gitignore`.

Alternatively, clone this repository and copy the files from `examples/basic-bot/` into your new bot directory. The repository's own development dependencies are separate from your bot project.

## 4. Start and play

```sh
node --env-file=.env index.js
```

Wait for both the Discord login and `Lavalink connected` messages. Join a voice channel and send commands in a text channel:

| Command | Action |
| --- | --- |
| `!play song name` | Search SoundCloud and queue the first result |
| `!play https://soundcloud.com/artist/track` | Load a track URL |
| `!play https://soundcloud.com/artist/sets/playlist` | Queue the playlist in order |
| `!pause` | Pause playback |
| `!resume` | Resume playback |
| `!skip` | Stop the current track and advance the queue |
| `!leave` | Destroy the player and disconnect |

This is a small starter bot. Test it in your own server before extending it with slash commands, permissions, rate limits, and production recovery logic.

## How the example works

1. `new Manager(...)` declares Lavalink nodes and a `send` callback that forwards voice packets to the guild's Discord shard.
2. `manager.init(client.user.id)` connects to Lavalink after Discord is ready.
3. Discord raw events are passed to `manager.updateVoiceState(packet)` so Lavalink receives voice connection details.
4. `manager.search(query, requester, ["soundcloud"])` loads metadata. Source names must match sources enabled on your Lavalink server.
5. `manager.create(...)` creates a player for a guild, and `player.connect()` joins its voice channel.
6. `player.queue.add(...)` queues tracks. The first item becomes `queue.current`; upcoming items live in the queue array. `player.play()` requires a current track.

Search results represent alternative matches: queue the first result. Playlist results represent multiple tracks: queue the entire list. Automatic queue advancement is enabled by default with `playNextOnEnd`.

## Next steps

Read [the usage reference](usage.md) for player controls, autoplay, events, source selection, and session recovery. Use [troubleshooting](troubleshooting.md) when a connection or playback step fails.
