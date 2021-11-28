const Discord = require("discord.js")
const { Intents, Collection } = require("discord.js")
const { MessageEmbed } = require("discord.js")
const client = new Discord.Client({
    messageCacheLifetime: 60,
    fetchAllMembers: false,
    messageCacheMaxSize: 10,
    cacheRoles: true,
    cacheChannels: true,
    intents: [Intents.FLAGS.GUILDS, "GUILD_VOICE_STATES"]
})

const fs = require("fs")
const { TOKEN, PREFIX, YTCK, TOPKEN } = require("./config.json")
const filters = require("./filters.json")
const DisTube = require("distube")
client.login(TOKEN)
client.commands = new Discord.Collection()
client.prefix = PREFIX
client.aliases = new Discord.Collection()
const cooldowns = new Discord.Collection()
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

// Client events
let olduser = ""
let oldid = ""
const http = require('http');
const express = require('express');
const app = express();
const { table } = require('table')
var server = http.createServer(app);
app.get("/", (request, response) => {
const ping = new Date();
ping.setHours(ping.getHours() - 3);
console.log(`Ping foi entregue ás ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
response.sendStatus(200);
});
app.listen(process.env.PORT);
const config = {
    columnDefault: {
        width: 30
    },
    border: {
        topBody: `─`,
        topJoin: `┬`,
        topLeft: `┌`,
        topRight: `┐`,
    
        bottomBody: `─`,
        bottomJoin: `┴`,
        bottomLeft: `└`,
        bottomRight: `┘`,
    
        bodyLeft: `│`,
        bodyRight: `│`,
        bodyJoin: `│`,
    
        joinBody: `─`,
        joinLeft: `├`,
        joinRight: `┤`,
        joinJoin: `┼`
    },
  header: {
    alignment: 'center',
    content: 'Command Handler Status\nBelow are each command and i\'ts status',
  },
}
const c = require("ansi-colors")
const data = [
  [`${c.bold("COMMAND")}`, `${c.bold("STATUS")}`]
]  
client.on("ready", () => {
  console.log(`------------------------------------\n`)
    console.log(table(data, config));
    console.log(`------------------------------------\n${client.user.username} ready!`)
    const server = client.guilds.cache.size
})

// Debug | client.on("debug", (e) => console.info(e))
client.on("warn", (info) => console.log(info))
client.on("error", console.error)

// Import Music Commands
client.commands = new Collection();
fs.readdir("./commands/music/", (_err, files) => {
    const jsFiles = files.filter(f => f.split(".").pop() === "js")
    if (jsFiles.length <= 0) return console.log("I can't find the command!")
    jsFiles.forEach((file) => {
        let cmdName = file.substring(0, file.indexOf(".js"));
        const cmd = require(`./commands/music/${file}`)
        client.commands.set(cmd.data.name, cmd)
        console.log(file)
        if (cmd.aliases) cmd.aliases.forEach(alias => client.aliases.set(alias, cmd.name))
        data.push([`${c.blue(cmdName)}`, `${c.bgGreenBright("SUCCESS")}`])
    })
})

// client on
client.on("message", async message => {
    if (!message.guild || message.author.bot || message.channel.type === "dm") return
    const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(PREFIX)})\\s*`)
    if (!prefixRegex.test(message.content)) return

    const [, matchedPrefix] = message.content.match(prefixRegex)

    const args = message.content.slice(matchedPrefix.length).trim().split(/ +/)
    const commandName = args.shift().toLowerCase()

    const command =
    client.commands.get(commandName) ||
    client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))

    if (!command) return

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection())
    }

    const now = Date.now()
    const timestamps = cooldowns.get(command.name)
    const cooldownAmount = (command.cooldown || 1) * 1000

    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000
            return message.reply(
                `You can use \`${command.name}\` in ${timeLeft.toFixed(1)} seconds`
            )
        }
    }

    timestamps.set(message.author.id, now)
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)

    try {
        command.run(client, message, args)
    } catch (error) {
        console.error(error)
        message.reply(`Error: ${error}`).catch(console.error)
    }
})

// DisTube for music
client.distube = new DisTube.default(client, {
    searchSongs: 10,
    leaveOnEmpty: true,
    customFilters: filters,
})

const status = (queue) => `Volume: \`${queue.volume}%\` Filter: \`${queue.filter || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "Queue" : "Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``

client.distube
    .on("playSong", (message, queue, song) => {
        distube.voice.get(message).setSelfDeaf(true) // SelfDeaf
        // embed
        const Embed = new MessageEmbed()
            .setTitle("Now Playing")
            .setColor("RANDOM")
            .addField("Name:", `[\`${song.name}\`](${song.url})`, true)
            .addField("Duration", `\`${song.formattedDuration}\``, true)
            .addField("Requested by:", `\`${song.user.tag}\``, true)
            .addField("Filter:",  `\`${queue.filter || "❌"}\``, true)
            .addField("Loop:", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Queue" : "Song" : "Off"}\``, true)

            .setTimestamp()
        if (!song.thumbnail === null) {
            Embed.setThumbnail(`${song.thumbnail}`)
        }
        if(oldid != "") {
            message.guild.members.cache.get(oldid).setNickname(olduser)
        }
        let gmember = message.guild.members.cache.get(song.user.id)
        console.log('Pass')
        olduser = gmember.displayName
        oldid = song.user.id
        console.log('Pass 2')
        message.guild.members.cache.get(song.user.id).setNickname('[📀] ' + gmember.displayName)
        // end embed
        queue.textChannel.send(Embed)
    })

    .on("addSong", (message, queue, song) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle("Song Added")
            .setColor("RANDOM")
            .addField("Name:", `[\`${song.name}\`](${song.url})`, true)
            .addField("Duration", `\`${song.formattedDuration}\``, true)
            .addField("Requested by:", `\`${song.user.tag}\``, true)
            .addField("Queued Position:", `\`${queue.songs.length}\``, true)
            .setTimestamp()
        if (!song.thumbnail === null) {
            Embed.setThumbnail(`${song.thumbnail}`)
        }
        // end embed
        queue.textChannel.send(Embed)
    })

    .on("playList", (message, queue, playlist, song) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle("Playlist Playing")
            .setColor("RANDOM")
            .addField("Playlist Name:", `\`${playlist.name}\``, true)
            .addField("Song name:", `\`${song.name}\` - \`${song.formattedDuration}\``, true)
            .addField("Requested by:", `\`${song.user.tag}\``, true)
            .addField("Filter:",  `\`${queue.filter || "❌"}\``, true)
            .addField("Loop:", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Queue" : "Song" : "Off"}\``, true)
            .setTimestamp()
        // end embed
        queue.textChannel.send(Embed)
    })
    .on("addList", (message, queue, playlist) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle("Playlist added")
            .setColor("RANDOM")
            .addField("Name", `\`${playlist.name}\``)
            .addField("Length", `${playlist.songs.length} song(s).`)
            .addField("Filter:",  `\`${queue.filter || "❌"}\``)
            .addField("Loop:", `\`${queue.repeatMode ? queue.repeatMode === 2 ? "Queue" : "Song" : "Off"}\``)
            .setTimestamp()
        // end embed
        queue.textChannel.send(Embed)
    })
    .on("initQueue", queue => {
        queue.autoplay = false
    })
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0
        const resultname = result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")
        // embed
        const Embed = new MessageEmbed()
            .setTitle("Search")
            .setColor("RANDOM")
            .setDescription(`**Insert a number, the selection will cancel in 60 seconds**!\n\n${resultname}`)
            .setTimestamp()
        // end embed
        message.channel.send(Embed)
    })
    // DisTubeOptions.searchSongs = true
    .on("empty", message => {})
    .on("finish", (queue, message) => {
        // embed
        const Embed = new MessageEmbed()
            .setTitle("The song ended!")
            .setColor("RANDOM")
            .setDescription("If you don't want to listen music anymore, type `jbl leave`")
        // end embed
        if(oldid != "") {
            message.guild.members.cache.get(oldid).setNickname(olduser)
            oldid = ""
        }
        queue.textChannel.send(Embed)
    })
    .on("searchCancel", (channel) => channel.send(":x: Selection has ben stopped! A invalid number has been choosen or you typed cancel."))
    .on("error", (message, err) => console.log(`Error: ${err}`))
    .on("noRelated", channel => channel.send("Error 404: Video not found"))
    .on("searchNoResult", () => {})
    .on("searchInvalidAnswer", () => {})
    .on("searchDone", () => {})
