module.exports = {
    name: "volume",
    aliases: ["vol"],
    description: "Song volume",
    cooldown: "5",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) return message.channel.send("Are you listening?!")
        const volume = parseInt(args[0])
        if (isNaN(volume) || volume > 100) return message.channel.send("`Use a value between 0-100`, the default value is `50%`")
        try {
            client.distube.setVolume(message, volume)
            message.channel.send(`Sucessfully set the value to\`${volume}%\``)
        } catch (e) {
            message.channel.send(`Error\`${e}\``)
        }
    }
}
