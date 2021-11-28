module.exports = {
    name: "autoplay",
    aliases: ["ap"],
    description: "Autoplay next songs!",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) return message.channel.send("There isn't any song playing!")
        const mode = client.distube.toggleAutoplay(message)
        message.channel.send(`Autoplay mode turned ${(mode ? "On!" : "Off!")}`)
    }
}
