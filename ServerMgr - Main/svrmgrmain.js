const Discord = require('discord.js');
const fs = require('fs');
const jsonfile = require('jsonfile');
const Client = new Discord.Client();

var data = {}; //start of member activeness tracker
if (fs.existsSync('data.json')) {
    data = jsonfile.readFileSync('data.json');
}

console.log("Bot Starting...");

Client.on("ready", () => console.log('ServerMgr is ready!  Now managing servers!'));  //bot init complete

Client.on("message", (message) =>  {

    if (message.guild.id in data === false) {data[message.guild.id] = {} } //if new guild

    const guildData = data[message.guild.id];

    if (message.author.id in guildData === false) {
        guildData[message.author.id] = {
            username: message.author.username,
            message_count: 0,
            last_message: 0,
            age: 0,
            times_left: 0,
            warnings: 0,
            strikes: 0,
            notes: "No notes added"
         }
    }

    const userData = guildData[message.author.id];
    userData.message_count ++
    userData.last_message = Date.now();

    jsonfile.writeFileSync('data.json', data)

    const parts = message.content.split(' ') 
    if(parts[0] === ';ping') {message.reply('```SeverMgr is online!\nCurrent Ping: ' + (Math.abs(Date.now() - message.createdTimestamp))/ 100 + " ms```")}
    if(parts[0] === ';read') {
        if (message.mentions.members.first()) {
            var user = message.mentions.users.first()
            const id = user.id
            const userData = guildData[id]
            const lastMessage = new Date(userData.last_message)
            message.channel.send("```Getting data for " + user.username + "#" + user.discriminator + "...```")
            message.channel.send("```Sent " + userData.message_count + " messages\n" + 
            "Last message was sent at: " + lastMessage + "\n" +
            "Age: " + userData.age + "\n" + 
            "Times user left server: " + userData.times_left + "\n" +
            "Warnings: " + userData.warnings + "\n" +
            "Strikes: " + userData.strikes + "\n" + 
            userData.notes + "```");

            console.log(message.author.username + " requested data for " + message.mentions.members.first().username)

        } else {
        message.reply("`You need to mention a user to get their data!`");
        }

        
    }

    
    
     if(parts[0] === ';write') {
        if (message.mentions.members.first()) {

            var user = message.mentions.users.first();
            const id = user.id;
            const userData = guildData[id];
            
            if (id in guildData == false) {
                message.channel.send("```Sorry, that user isn't in our database!  I will create a blank sheet for them!```")
                guildData[id] = {
                    username: user.username,
                    message_count: 0,
                    last_message: 0,
                    age: 0,
                    times_left: 0,
                    warnings: 0,
                    strikes: 0,
                    notes: "No notes added"
                 }
                 return
            }

            message.channel.send("```What data point do you want to edit? \n Accepted responses are: ```\n `message count` \n `age` \n `times left` \n `warnings ` \n `strikes` \n `notes` ")
            //let filter = m => m.content.includes('message count' || 'age' || 'times left' || 'strikes' || 'notes') && !m.author.bot ;
            let filter = m => !m.author.bot
            let collector = new Discord.MessageCollector(message.channel, filter);

    collector.on('collect', (m,col) => {
        var res = "";
        let mess = m.content;
        
        if (mess == ("message count")) {res = 'message_count' } 
        if (mess == ("age")) {res = 'age' }
        if (mess == ("times left")) {res = 'times_left' }
        if (mess == ("warnings")) {res = 'warnings' }
        if (mess == ("strikes")) {res = 'strikes' }
        if (mess == ("notes")) {res = 'notes' }

        
        message.channel.send("`Editing " + res + "\n The current value is:`");

        var oldData = ""

        if (res == "message count") {message.channel.send(userData.message_count); oldData = userData.message_count } 
        if (res == "age") {message.channel.send(userData.age); ; oldData = userData.age}
        if (res == "times left") {message.channel.send(userData.times_left); oldData = userData.times_left}
        if (res == "warnings") {message.channel.send(userData.warnings); oldData = userData.warnings}
        if (res == "strikes") {message.channel.send(userData.strikes); oldData = userData.strikes}
        if (res == "notes") {message.channel.send(userData.notes); oldData = userData.notes}

        collector.stop();
        message.channel.send("The value currently located inside of " + res + " will be overwritten, so if you want to edit the content directly, copy the message above, and paste it into the send box.");
        let filter = m => !m.author.bot;
        let collector2 = new Discord.MessageCollector(message.channel, filter);
         collector2.on('collect', m => {
       
            var mess = m.content;
            if (res === "message_count") {userData.message_count = mess } 
            if (res == "age") {userData.age = mess}
            if (res == "times_left") {userData.times_left = mess}
            if (res = "warnings") {userData.warnings = mess}
            if (res == "strikes") {userData.strikes = mess}
            if (res == "notes") {userData.notes = mess}
           
            message.channel.send("`Data saved!`");
            
            const lastMessage = new Date(userData.last_message)
            
            message.channel.send("```New Data: \nSent " + userData.message_count + " messages\n" + 
            "Last message was sent at: " + lastMessage + "\n" +
            "Age: " + userData.age + "\n" + 
            "Times user left server: " + userData.times_left + "\n" +
            "Warnings: " + userData.warnings + "\n " +
            "Strikes: " + userData.strikes + "\n" + 
            userData.notes + "```");
    
            data[message.guild.id][id][res] = mess
            jsonfile.writeFileSync('data.json', data)
            collector2.stop()

    console.log("Data updated for user " + user.username + " in category " + res + "\n Old data: " + oldData + "\n New Data: " + mess)
        
    });
    });

   

    } else {
        message.reply("```You need to mention a user to edit their data!```");
    }
}
    if(parts[0] === ';amongus') { //among us stuff
        /*
        if (parts[1] == 'start') {
           message.guild.channels.create("Among Us", {type: 'voice'})
           const channel = Client.channels.find("name", "Among Us")
           message.author.voice.setChannel(channel)

        }
*/
        if (parts[1] == 'mute') {
            if (message.member.hasPermission('MANAGE_MESSAGES')) {
        
                if (message.member.voice.channel) {
        
                    let channel = message.member.voice.channel;
                    const members = channel.members
        
        
                    members.forEach(member => {
                        member.voice.setMute(true)
                    })
            
        
                        message.react("👌")
        
                        
                    }
                }
        
        }

        if (parts[1] == 'unmute') {
            if (message.member.hasPermission('MANAGE_MESSAGES')) {
        
                if (message.member.voice.channel) {
        
                    let channel = message.member.voice.channel;
                    const members = channel.members
        
        
                    members.forEach(member => {
                        member.voice.setMute(false)
                    })
            
        
                        message.react("👌")
        
                        
                    }
                }
        
        


    }
}
});

Client.login('Nzc5OTA0Njc2ODc5MDA3NzQ0.X7nU1A.J7_kWN-UNxB6Ha4O40ngWC-1E_k')