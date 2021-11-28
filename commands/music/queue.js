module.exports = {
    name: "queue",
    aliases: ["q"],
    description: "Server queue",
    cooldown: "5",
    run: async (client, message) => {
        const queue = client.distube.getQueue(message)
        if (!queue) return message.channel.send("There are no songs in the queue!")
        let money = queue.songs
    money.length = 10;
    var finalLb = "";
    var i = 0;
    let indexnum = 0;
    for (i in money) {

    let song = queue.songs[0]
    finalLb += `${++indexnum}. ${money[i].name} [${money[i].formattedDuration}]\n\n`;
}
        const q =
        message.channel.send(`\`\`\`css
Server Queue

⬐⬐⬐⬐⬐
Now playing: ${queue.songs[0].name} [${queue.songs[0].formattedDuration}]
Queue total duration: ${queue.formattedDuration}
⬑⬑⬑⬑⬑

${finalLb}\`\`\``,)
    }
}
