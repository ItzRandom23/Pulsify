const { Client, GatewayIntentBits, Events } = require("discord.js");
const { Manager, SearchPlatform, LoadTypes } = require("pulsify");

const { DISCORD_TOKEN, LAVALINK_PASSWORD } = process.env;
if (!DISCORD_TOKEN || !LAVALINK_PASSWORD) {
  throw new Error("Set DISCORD_TOKEN and LAVALINK_PASSWORD in your .env file.");
}

const client = new Client({ intents: [
  GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates,
  GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent,
] });
const manager = new Manager({
  nodes: [{ identifier: "main", host: process.env.LAVALINK_HOST || "127.0.0.1",
    port: Number(process.env.LAVALINK_PORT || 2333), password: LAVALINK_PASSWORD,
    useSSL: process.env.LAVALINK_SSL === "true" }],
  defaultSearchPlatform: SearchPlatform.SoundCloud,
  send(guildId, payload) { client.guilds.cache.get(guildId)?.shard.send(payload); },
});

manager.on("nodeConnect", node => console.log(`Lavalink connected: ${node.options.identifier}`));
manager.on("nodeError", (node, error) => console.error("Lavalink error:", error));
manager.on("trackError", (player, track, error) => console.error("Track error:", error));
manager.on("trackStart", (player, track) => {
  client.channels.cache.get(player.textChannelId)?.send({
    content: `Now playing: ${track.title}`, allowedMentions: { parse: [] },
  }).catch(console.error);
});
client.once(Events.ClientReady, readyClient => {
  manager.init(readyClient.user.id);
  console.log(`Logged in as ${readyClient.user.tag}`);
});
client.on(Events.Raw, packet => {
  manager.updateVoiceState(packet).catch(console.error);
});

// Serialize commands per guild so simultaneous commands keep their queue order.
const pending = new Map();
client.on(Events.MessageCreate, message => {
  if (!message.guild || message.author.bot || !message.content.startsWith("!")) return;
  const [command, ...args] = message.content.slice(1).trim().split(/\s+/);
  if (!["play", "pause", "resume", "skip", "leave"].includes(command)) return;
  const guildId = message.guild.id;
  const task = (pending.get(guildId) || Promise.resolve()).then(async () => {
    const voice = message.member?.voice.channel;
    if (!voice) return message.reply("Join a voice channel first.");
    let player = manager.players.get(guildId);
    if (player && player.voiceChannelId !== voice.id) {
      return message.reply("Join my voice channel to control playback.");
    }
    if (command === "play") {
      const query = args.join(" ");
      if (!query) return message.reply("Use !play followed by a song name or link.");
      const result = await manager.search(query, message.author, ["soundcloud"]);
      if (!result.tracks.length) return message.reply("No playable tracks found. Check your Lavalink source configuration.");
      player ||= manager.create({ guildId, voiceChannelId: voice.id,
        textChannelId: message.channel.id, selfDeafen: true, volume: 50 });
      player.connect();
      // Search results are alternatives; playlists contain consecutive tracks.
      const tracks = result.loadType === LoadTypes.Playlist ? [...result.tracks] : [result.tracks[0]];
      const count = tracks.length;
      player.queue.add(tracks);
      if (!player.playing && !player.paused && player.queue.current) await player.play();
      return message.reply(`Added ${count} track(s).`);
    }
    if (!player) return message.reply("There is no active player.");
    if (command === "pause") await player.pause(true);
    if (command === "resume") await player.pause(false);
    if (command === "skip") {
      if (!player.queue.current) return message.reply("Nothing is playing.");
      await player.stop();
    }
    if (command === "leave") await player.destroy();
    await message.reply("Done.");
  }).catch(async error => {
    console.error(error);
    await message.reply("Playback failed. Check the bot and Lavalink logs.").catch(console.error);
  });
  pending.set(guildId, task);
  task.finally(() => { if (pending.get(guildId) === task) pending.delete(guildId); }).catch(console.error);
});

client.login(DISCORD_TOKEN).catch(console.error);
