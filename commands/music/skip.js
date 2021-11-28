
module.exports = {
    name: "skip",
    aliases: ["s"],
    description: "Skip the current song",
    cooldown: "5",

    run: async (client, message) => {
          const queue = client.distube.getQueue(message)
        const song = queue.songs[0]
        const name = song.name
      const db = require("quick.db")
      let vop = db.fetch(`voteonp_${message.guild.id}`),
      vmsg = db.set(`votemsg_${message.guild.id}`)
      if(vop == 1) {
        return message.channel.send("There's a vote already in progress! \nVote Message: "+vmsg)
      }
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to use this command")
        if (!client.distube.isPlaying(message)) return message.channel.send("Are you listening!?")
        let votes = 0;
        let voiceMembers = message.member.voice.channel.members.size - 2;
        if(message.member.voice.channel.members.size == 3) {
          voiceMembers = message.member.voice.channel.members.size - 1;
        }
        if(message.member.voice.channel.members.size == 2) {
          voiceMembers = message.member.voice.channel.members.size;
        }
        if(message.member.voice.channel.members.size == 1) {
          client.distube.skip(message)
         return message.channel.send(`⏩ Skipped!`)
        }
              db.set(`voteonp_${message.guild.id}`, 1)
      db.set(`votemsg_${message.guild.id}`, message.url)
        let myButton = new MessageButton().setStyle("green").setLabel("⬆️ Vote").setID("chr");
        let row = new MessageActionRow().addComponents(myButton) 
            message.channel.send(`⏩ Skip? ${votes}/${voiceMembers}`, {components: row}).then(mesg => {
          let filter = (button1) => button1.clicker.user.id === button1.clicker.user.id;
          let collector = mesg.createButtonCollector(filter);
          
          collector.on('collect', async(x) => {
            x.reply.defer()
            votes = votes + 1
           if(votes >= voiceMembers) {
          client.distube.skip(message)
         message.channel.send(`⏩ Skipped!`)
          db.set(`voteonp_${message.guild.id}`, 0)
      db.set(`votemsg_${message.guild.id}`, null)
          return mesg.delete()
        }
          mesg.edit(`⏩ Skip? ${votes}/${voiceMembers}`)
          
        setInterval(function() {
                  const nqueue = client.distube.getQueue(message)
        const nsong = nqueue.songs[0]
        const nname = nsong.name
         if(nname != name) {
           message.channel.send("Vote Expired!")
           mesg.delete()
        db.set(`voteonp_${message.guild.id}`, 0)
       return db.set(`votemsg_${message.guild.id}`, null)
         }
        }, 1000)
            })
            })
    }
}
