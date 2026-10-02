# Troubleshooting

| Symptom | What to check |
| --- | --- |
| `No available nodes` | Wait for `nodeConnect`; check Lavalink host, port, password, TLS, and firewall. |
| Lavalink returns 401 | A node connection 401 usually indicates the Lavalink password; a provider API 401 indicates provider authentication. Check which endpoint failed. |
| Bot ignores `!play` | Enable Message Content Intent in the portal and the client; verify text channel permissions. |
| Bot joins but stays silent | Forward Discord raw voice events to `updateVoiceState`, request GuildVoiceStates, and check Connect/Speak permissions and server track exceptions. |
| Search returns no tracks | Enable the requested source on Lavalink. Install required source plugins and configure credentials if applicable. |
| `No current track` | Add a valid track to the queue before calling `play()`. Check queue state again after asynchronous work. |
| Playlist loading times out | Check source plugin logs. Metadata loading should avoid fetching a stream for every playlist entry. |
| Session does not recover | Keep the session data directory, enable session resuming, and inspect whether the server session survived. |

Log node errors and track errors separately. A successful metadata search is different from successful audio playback.

When opening [an issue](https://github.com/ItzRandom23/Pulsify/issues), include Node.js, Pulsify, discord.js, Lavalink, and source plugin versions; the failing command or public track URL; relevant errors; and a small reproduction. Remove bot tokens, server passwords, cookies, and provider credentials from logs first.
