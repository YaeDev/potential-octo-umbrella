module.exports = {
    name: "resume",
    description: "Resume the current song",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("There are no songs in the queue.")
        try {
            message.channel.send("Resumed the song. :musical_note:")
            client.distube.resume(message)
        } catch (e) {
            message.channel.send(`Error \`${e}\``)
        }
    }
}
