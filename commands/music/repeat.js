module.exports = {
    name: "repeat",
    aliases: ["loop"],
    description: "loop",
    cooldown: "5",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("There are no songs in the queue.")
        if (!queue && !client.distube.isPlaying(message)) return message.channel.send("Are you listening the music?!")
        let mode = null
        switch (args[0]) {
            case "Off":
                mode = 0
                break
            case "Turn it off":
                mode = 0
                break
            case "Song":
                mode = 1
                break
            case "one":
                mode = 1
                break
            case "all":
                mode = 2
                break
            case "Queue":
                mode = 2
                break
        }
        mode = client.distube.setRepeatMode(message, mode)
        mode = mode ? mode === 2 ? "`Queue` To do" : "`Song` To do" : "`Off`in"
        message.channel.send(`Loop set to ${mode}`)
    }
}
