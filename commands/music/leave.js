module.exports = {
    name: "leave",
    aliases: ["quit", "disconnect"],
    description: "Make the bot disconnect from the voice channel",
    cooldown: "5",

    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (client.distube.isPlaying(message)) {
            const filter = m => m.author.id === message.author.id
            return message.channel.send("There's a song (or playlist) playing. Do you want to stop the song and make the bot leave? **(Yes/No)**").then(() => {
                message.channel.awaitMessages(filter, {
                    max: 1,
                    time: 30000,
                    errors: ["time"]
                })
                    .then(message => {
                        message = message.first()
                        if (message.content === "Yes") {
                            client.distube.stop(message)
                        } else if (message.content === "No") {
                            message.channel.send("I'll remain playing the song for you")
                        } else {
                            message.channel.send("Invalid entry")
                        }
                    })
                    .catch(collected => {
                        message.channel.send("30 seconds have passed. Cancelled the selection.")
                    })
            })
        }
        message.guild.voice.channel.leave()
    }
}
