module.exports = {
    name: "filter",
    description: "filter command",
    aliases: [],
    cooldown: "3",
    run: async (client, message, args) => {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("There are no songs in the queue.")
        const songislive = queue.songs[0].isLive
        if(args[0].includes('ist')) {
           return message.channel.send(`\`\`\`diff
⬐⬐⬐⬐⬐
Current Filter: ${queue.filter || "Off"}
⬑⬑⬑⬑⬑

- clear
- bassboost
- 8D
- vaporwave
- nightcore
- phaser
- tremolo
- vibrato
- reverse
- treble
- normalizer
- surrounding
- pulsator
- subboost
- karaoke
- flanger
- gate
- haas
- mcompand,
- double,
- half\`\`\``)
        }
        if (songislive === true) return message.channel.send("Filters can't be used in live broadcasting due to many issues.")
        if ((args[0] === "Off" || args[0] === "off") && queue.filter) client.distube.setFilter(message, queue.filter)
        else if (Object.keys(client.distube.filters).includes(args[0])) client.distube.setFilter(message, args[0])
        else if (!args[0] || !Object.keys(client.distube.filters).includes(args[0])) return message.channel.send(`Filter status: \`${queue.filter || "Off"}`)
        message.channel.send(`Filter status: \`${queue.filter || "Off"}\``)
    }
}
