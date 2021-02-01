const Discord = require('discord.js');
const Client = new Discord.Client();
const dotenv = require('dotenv');
const time = require('date-and-time')

const low = require("lowdb")
const FileSync = require("lowdb/adapters/FileSync")
const adapter = new FileSync("data.json")
const db = low(adapter)
db.defaults({
    users: []
}).write()

dotenv.config();

console.log("Management Module Starting...");

Client.on("ready", () => {console.log('Management Module Ready!')//bot init complete
console.log(`Logged in as ${Client.user.tag}`)
console.log(`Server time is ${Date.now()}`)
console.log(`Websocket heartbeat: ${Client.ws.ping}ms.`)
}); 



var Countdowns = []


//Commands

Client.on('message', (message) => {

    if (message.author.bot) return;
    const parts = message.content.split(' ')

        if (parts[0] == ";ranch") {
            if (CheckMod(message)) return
            const ranchRole = message.guild.roles.cache.find(r => r.name === "Ranched")
            const victim = message.mentions.members.first();
            const reason = parts[3]
            victim.roles.add(ranchRole)

            if (reason == ""){reason = "No Reason Specified"}
            message.channel.send(SendSucessEmbed("Sucess",`Sucessfully ranched ${victim.user.username} for ${reason}!`))
            victim.send(SendErrorEmbed("You have been ranched for: " + reason, "You are unable to speak in text channels for an undertermined amount of time."))

        }

        if (parts[0] == ";unranch") {
            if (CheckMod(message)) return
            const ranchRole = message.guild.roles.cache.find(r => r.name === "Ranched")
            const victim = message.mentions.members.first();

            if (victim.roles.valueOf(ranchRole.id) != -1 ){
            victim.roles.remove(ranchRole)
            }

            message.channel.send(SendSucessEmbed("Sucess",`Sucessfully unranched ${victim.user.username}!`))
    }

    if (parts[0] == ";countdown") {
        if (!parts[1]) {
            message.channel.send(SendErrorEmbed("Error:","You need to provide a UTC date value!"))
            return
        }

        const pattern = time.compile('ddd, MMM DD YYYY, [at] hh:mm A [EST]');
        const endTime = parts[1]

        const startTime = new Date()
        

        message.channel.send("Creating Countdown...")
        Countdowns.push(message.channel.lastMessageID())
        var count

        for (; count > 0 ;){
            count = time.subtract()  
            count = time.subtract(Date.now(), startTime)
        var timeEmbed = new Discord.MessageEmbed()
        .setTitle(`Countdown to ${time.format(endTime, pattern )}`)
        .setDescription(`${time.format(count, pattern)}`)
        .setTimestamp()

        Countdowns.forEach(element => {
            message.guild.channels.cache.find(element).edit(timeEmbed)
        });


     }
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


    const imageChannels = ['805552526061076531']
    if (imageChannels.includes(message.channel.id))
    if (message.attachments.size > 0 || message.content.includes("://") || message.author.bot) {
        message.react("⏫").then(message.react('⏬'))
    } else { 
    
    
    message.author.send(SendErrorEmbed("Error: ", "Your message must contain an image or a link!"))
    message.delete()
    }



    //Slowmode
    //if we got here, it's database time!

    //check if it's a valid user that is in the db, else create a new profile


    const userdb = db.get('users')
    const userData = userdb.find({
        id: message.author.id
    }).value()

    console.log(userData)
    
    if (!userData != []) {
            
            console.log('a')

            const user = {
                id: message.author.id,
                nickname: message.member.user.username,
                last_message: Date.now()
        }
        userdb.push(user).write() //update db with new user profile
        return

    }

    //check current time with last message

    if (message.member.roles.cache.find(r => r.name === 'Slowmode')) {
        if (Date.now() - userData.last_message < process.env.SLOWMODE) {

            //check failed, send message

            message.author.send(`You are talking too quickly! You have ${(process.env.SLOWMODE / 1000) - Math.floor((Date.now() - userData.last_message) / 1000)} seconds until you can talk again!`)
            message.delete()
        } else {
            //update with current time

        userdb.find({id: message.author.id}).assign({last_message: new Date().getTime()}).write()
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

function CheckMod(object) {
    return object.member.roles.cache.find(r => r.name === "Mods")
}

Client.login(process.env.TOKEN)