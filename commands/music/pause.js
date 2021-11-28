module.exports = {
    name: "pause",
    description: "Pause the music",
    cooldown: "5",
    run: async (client, message) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) {
            client.distube.resume(message)
            return message.channel.send("Resuming the song. :musical_note:")
        }
        try {
            message.channel.send("I sucessfully paused the song, *Please enter it again to play it again or enter ht!resume.*")
            client.distube.pause(message)
        } catch (e) {
            message.channel.send(`Error \`${e}\``)
        }
    }
}
