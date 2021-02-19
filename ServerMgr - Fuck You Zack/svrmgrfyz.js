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

console.log("Fuck You Zack Module Starting...");

Client.on("ready", () => {console.log('Management Module Ready!')//bot init complete
console.log(`Logged in as ${Client.user.tag}`)
console.log(`Server time is ${Date.now()}`)
console.log(`Websocket heartbeat: ${Client.ws.ping}ms.`)
}); 



var Countdowns = []


//Commands

Client.on('message', (message) => {
    if (message.author.bot) {
        return
    }
    if (message.author.id == '804180967874756609') {
       if (message.content.includes('@everyone')) {
         message.channel.send("```Sorry for the ghost ping, the server owner sent another useless @everyone.  We are trying to reform him, so please understand while we work.\n \nHere is the message content for yall: \n \n" + message.content + " ```")
         message.author.send(returnRandomTime())
         message.delete()
        }
    }
})
Client.login(process.env.TOKEN)

function returnRandomTime() {
    const h = Math.floor(Math.random() * 17)
    const m = Math.floor(Math.random() * 59)
    const s = Math.floor(Math.random() * 59)

    return `You have ${h} Hours, ${m} Minutes, and ${s} seconds left before you can send another @everyone.`

}