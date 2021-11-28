module.exports = {
    name: "stop",
    description: "Stop the song",
    cooldown: "5",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) return message.channel.send("Are you listening?!")
        const filter = m => m.author.id === message.author.id
        return message.channel.send("Should I stop the song? **(Yes/No)**").then(() => {
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
                        message.channel.send("Fine, I will continue playing!")
                    } else {
                        message.channel.send("Invalid entry!")
                    }
                })
                .catch(collected => {
                    message.channel.send("30 seconds passed, cancelled the selection")
                })
        })
    }
}
