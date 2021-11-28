const { MessageEmbed } = require("discord.js")
const createBar = require("string-progressbar")
const { toColonNotation } = require("colon-notation")
module.exports = {
    name: "nowplaying",
    aliases: ["np"],
    description: "Displays the current song",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("There are no songs in the queue.")
        if (!queue && !client.distube.isPlaying(message)) return message.channel.send("Are you listening the song?")
        const song = queue.songs[0]
        const name = song.name
        const user = song.user.tag
        const avatar = song.user.displayAvatarURL({ dynamic: true, format: "png" })
        const link = song.url
        const time = song.duration * 1000
        const currenttime = queue.currentTime
        const tn = song.thumbnail
        const remaining = (time - currenttime) < 0 ? "◉ LIVE" : time - currenttime
        try {
            const embed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(user, avatar)
                .setTitle(name)
                .setURL(`${link}`)
                .setDescription(`${createBar(time === 0 ? currenttime : time, currenttime, 10)[0]} \`[${queue.formattedCurrentTime}/${song.formattedDuration}]\` \`[${toColonNotation(remaining)}]\``)
            if (!song.thumbnail === null) {
                embed.setThumbnail(`${tn}`)
            }
            message.channel.send(embed)
        } catch (e) {
            message.channel.send(`에러TV)\`${e}\``)
        }
    }
}
