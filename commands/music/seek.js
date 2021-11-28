const { toMilliseconds } = require("colon-notation")
module.exports = {
    name: "seek",
    aliases: [],
    description: "Seek the song",
    cooldown: "5",

    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) return message.channel.send("Are you listening?!")
        const queue = client.distube.getQueue(message)
        const duration = queue.songs.map(song => song.duration) * 1000
        const fduration = queue.songs.map(song => song.formattedDuration)
        const islive = queue.songs.map(song => song.isLive)
        const atm = toMilliseconds(args[0])
        if (islive === true) return message.channel.send("Live broadcasting is not supported.")
        if (atm > duration) return message.channel.send(`Please enter the correct number! The current video length is \`${fduration}\` 에요.`)
        message.channel.send(`'${args[0]}' jumps to the section, *If you jump too long, the song may start again.*`)
        client.distube.seek(message, Number(atm))
    }
}
