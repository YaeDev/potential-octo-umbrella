const { MessageEmbed } = require("discord.js")
const { getData } = require("spotify-url-info")

module.exports = {
    name: "play",
    aliases: ["p", "start"],
    description: "Play a song",
    cooldown: "5",
    run: async (client, message, args) => {
      let desc = "";
        if (!message.member.voice.channel) desc = "You need to be in a voice channel to use this command"
        const permissions = message.channel.permissionsFor(message.client.user)
        if (!permissions.has("CONNECT") && !permissions.has("SPEAK")) desc = "I can't SPEAK and CONNECT to this voice channel! Give me the correct permissions!"
        if (!permissions.has("CONNECT")) desc = "I can't CONNECT to this voice channel! Give me the correct permissions!"
        if (!permissions.has("SPEAK")) desc = "I can't SPEAK to this voice channel! Give me the correct permissions!"
        let errorembed = new MessageEmbed()
        .setTitle("Error")
        .setDescription(desc)
        .setColor('RED')
        .setFooter('If the error persists, contact us at our Support Server')
        if(desc != "") return message.reply(errorembed)
      client.distube.voices.join(message.member.voice.channel)

        const string = args.join(" ")
        const playEmbed = new MessageEmbed()
            .setTitle("Hana Music")
            .setColor("RANDOM")
            .addField("Playback URL", "[It supports numerous sites](https://ytdl-org.github.io/youtube-dl/supportedsites.html)\n")
            .addField("Spotify", `**Spotify is also available, but podcasts and albums are not supported.**`)
            .setTimestamp()
        if (!string) return message.channel.send(playEmbed)
        // spotify
        const spourl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(track)\/.+$/gi
        const spoalurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(album)\/.+$/gi
        const spoplurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(playlist)\/.+$/gi
        const sposhowurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(show)\/.+$/gi
        const spoepiurl = /^(https?:\/\/)+?(www\.)?(open\.spotify\.com)\/(episode)\/.+$/gi
        if (spourl.test(string)) {
            try {
                const spodata = await getData(string)
                if (!spodata) return message.channel.send("<:spotify:886230007352033280> Spotify link invalid.")
                const sposearch = spodata.name
                const spouri = spodata.uri
                message.channel.send(`https://scannables.scdn.co/uri/plain/png/000000/white/640/${spouri}`)
                message.channel.send("<:Chat:814864031869173780> Loading...")
                return client.distube.play(message, sposearch)
            } catch (e) {
                message.channel.send(`Error: \`${e}\``)
            }
        } else if (spoalurl.test(string)) {
            return message.channel.send("<:spotify:886230007352033280> Unfortunately I don't support Spotify albums!")
        } else if (spoplurl.test(string)) {
            try {
                const playlist = await getData(string)
                if (!playlist) return message.channel.send("<:spotify:886230007352033280> Spotify link invalid.")
                message.channel.send("<:spotify:886230007352033280> Loading... *It may take several minutes*")
                const items = playlist.tracks.items
                const tracks = []
                let s
                for (let i = 0; i < items.length; i++) {
                    const results = await client.distube.search(`${items[i].track.artists[0].name} - ${items[i].track.name}`)
                    if (results.length < 1) {
                        // eslint-disable-next-line no-unused-vars
                        s++ // could be used later for skipped tracks due to result not being found
                        continue
                    }
                    tracks.push(results[0].url)
                }
                await client.distube.playCustomPlaylist(message, tracks, { name: playlist.name })
            } catch (e) {
                message.channel.send(`Error \`${e}\``)
            }
        } else if (sposhowurl.test(string) || spoepiurl.test(string)) {
            return message.channel.send("<:spotify:886230007352033280> Unfortunately, Spotify podcasts are not supported.")
        } else if (!spourl.test(string) || !spoalurl.test(string) || !spoplurl.test(string) || !sposhowurl.test(string) || !spoepiurl.test(string)) {
            try {
                message.channel.send("<:Chat:814864031869173780> Loading...")
                client.distube.play(message, string)
            } catch (e) {
                message.channel.send(`:x: Error\`${e}\``)
            }
        }
    }
}
