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
            const reason = parts[3]
            victim.roles.add(ranchRole)

            if (reason == ""){reason = "No Reason Specified"}
            message.channel.send(SendSucessEmbed("Sucess",`Sucessfully ranched ${victim.user.username} for ${reason}!`))
            victim.send(SendErrorEmbed("You have been ranched for: " + reason, "You are unable to speak in text channels for an undertermined amount of time."))

        }

        if (parts[0] == ";unranch") {
            const ranchRole = message.guild.roles.cache.find(r => r.name === "Ranched")
            const victim = message.mentions.members.first();

            if (victim.roles.valueOf(ranchRole.id) != -1 ){
            victim.roles.remove(ranchRole)
            }

            message.channel.send(SendSucessEmbed("Sucess",`Sucessfully unranched ${victim.user.username}!`))
    }

    //non moderator
    const disallowedArguementList = ["no u", "stfu"]
    disallowedArguementList.forEach(element => {
        if (message.content.toLowerCase().includes(element)) {
            message.author.send(SendErrorEmbed("Disallowed Arguement!", `Your message contained "${element}", which is an illegal argument in this server.  Please get a better roast.`))
            console.log(element)
            message.delete()
        }

    });

    const imageChannels = ['802741630591303720', '795761260062441513']
    if (imageChannels.includes(message.channel.id))
    if (message.attachments.size > 0 || message.content.includes("://") || message.author.bot) {
        message.react("⏫").then(message.react('⏬'))
    } else { 
    
    
    message.author.send(SendErrorEmbed("Error: ", "Your message must contain an image or a link!"))
    message.delete()
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

function sleep(ms) {
    const start = Date.now()
    for (; Date.now() - start < ms;) {} 
    return
}

Client.login(process.env.TOKEN)