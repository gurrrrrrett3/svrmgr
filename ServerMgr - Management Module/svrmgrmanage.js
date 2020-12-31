const Discord = require('discord.js');
const Client = new Discord.Client();
const dotenv = require('dotenv');
dotenv.config();

console.log("Management Module Starting...");

Client.on("ready", () => {console.log('Management Module Ready!')//bot init complete
console.log(`Logged in as ${Client.user.tag}`)
console.log(`Server time is ${Date.now()}`)
console.log(`Websocket heartbeat: ${Client.ws.ping}ms.`)
}); 



//Commands

Client.on('message', (message) => {

    if (message.author.bot) return;
    const parts = message.content.split(' ')
    if(message.member.roles.cache.find(r => r.name === "Bot Manager")) { //Moderator ONLY

        if (parts[0] == ";ranch") {
            const ranchRole = message.guild.roles.cache.find(r => r.name === "Ranched")
            const victim = message.mentions.members.first();

            //victim.roles.cache.forEach(element => {
              //  victim.roles.remove(element)
           // });

            victim.roles.add(ranchRole)

            message.channel.send(SendSucessEmbed("Sucess",`Sucessfully ranched ${victim.user.username}!`))

        }
    }
 
})




function SendErrorEmbed(title, message) {
    const errorEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor("#FF0000")
    return errorEmbed
}

function SendSucessEmbed(title, message) {
    const sucessEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor("#00FF00")
    return sucessEmbed
}


Client.login(process.env.TOKEN)