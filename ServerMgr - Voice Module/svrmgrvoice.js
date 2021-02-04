const Discord = require('discord.js');
const Client = new Discord.Client();
const dotenv = require('dotenv');
const Canvas = require('canvas');

dotenv.config();

console.log("Voice Module Starting...");

Client.on("ready", () => {console.log('Voice Module Ready!')//bot init complete
console.log(`Logged in as ${Client.user.tag}`)
console.log(`Server time is ${Date.now()}`)
console.log(`Websocket heartbeat: ${Client.ws.ping}ms.`)
}); 

Client.on('voiceStateUpdate', (oldState, newState) => {


    if (oldState.channel == null || (oldState.channel != null && newState.channel != null)) {
        //deletes channel if moved out of private channel
        if (oldState.channel != null) {
            if (oldState.channel.members.size == 0 && oldState.channel.name.includes("⚙")) {
                oldState.channel.delete()
                console.log(`${oldState.channel.name} was deleted.`)
            }
        }
        // User Joins a voice channel

        // check for bot
        if (oldState.member.user.bot) return;
        //check if member joined the create channel
        if (newState.channel == null) {
            return
        } else {

            const privateChannels = ["805765637804130375"]
            const creationLocation = "805765393732861994"

            if (privateChannels.includes(newState.channel.id)) {
                //Create Channel
                newState.guild.channels.create(
                    `${newState.member.user.username}'s private channel | ⚙`, {
                        type: 'voice',
                        parent_id: creationLocation

                    }).then((channel) => {
                    channel.setParent(creationLocation);
                    newState.member.voice.setChannel(channel)
                    console.log(`${newState.member.user.username} created a Channel.`)
                })


            } else return

        }

    } else if (newState.channel == null) {

        // User leaves a voice channel

        if (oldState.channel.members.size == 0 && oldState.channel.name.includes("⚙")) {
            oldState.channel.delete()
            console.log(`${oldState.channel.name} was deleted.`)
        }

    }


    if (newState.member.voice.selfDeaf) {
        const afk = newState.guild.afkChannel
        newState.member.voice.setChannel(afk)
    }
})


//Commands

Client.on('message', (message) => {

    if (message.author.bot) return;

    if (message.content === '!join') {
		Client.emit('guildMemberAdd', message.member);
	}

    const parts = message.content.split(' ')
    if (parts[0] == '+') {

        //sanity checks

        if (message.member.voice.channel.name.includes(message.member.user.username) || message.author.id("232510731067588608")) { //user owns channel OR HACKERMAN
            if (message.mentions.users.size) { //user mentioned someone

                if (!message.member.voice.channel) {
                    message.channel.send(SendErrorEmbed("You can't do that!", "You need to be in a voice channel first!"))
                }


                const ownedChannel = message.member.voice.channel
                const mentionedUser = message.mentions.users.first()
                const mentionedMember = message.mentions.members.first()
                ownedChannel.updateOverwrite(mentionedUser, {
                    CONNECT: true,
                    SPEAK: true,
                    VIEW_CHANNEL: true
                })

                message.channel.send(SendSucessEmbed(`You invited ${mentionedUser.username} to your Private Channel!`, "They are now able to join, be sure to let them know!"))
                console.log(`${mentionedMember.user.username} was added to ${message.member.user.username}'s Channel.`)
            } else {
                message.channel.send(SendErrorEmbed("You can't do that!", "You need to mention a user to invite them!"))
            }
        } else {
            message.channel.send(SendErrorEmbed("You can't do that!", "You need to be the owner of this channel to invite someone!"))
        }
    }

    if (parts[0] == '-') {

        //sanity checks

        if (message.member.voice.channel.name.includes(message.member.user.username) || message.author.id("232510731067588608")) { //user owns channel (or ya know, HACKERMAN)
            if (message.mentions.users.size) { //user mentioned someone

                if (!message.member.voice.channel) {
                    message.channel.send(SendErrorEmbed("You can't do that!", "You need to be in a voice channel first!"))
                }


                const ownedChannel = message.member.voice.channel
                const mentionedUser = message.mentions.users.first()
                const mentionedMember = message.mentions.members.first()
                ownedChannel.updateOverwrite(mentionedUser, {
                        CONNECT: false,
                        SPEAK: false,
                        VIEW_CHANNEL: false
                    })
                    //kick user
                
                if (mentionedMember.voice.channel == ownedChannel) mentionedMember.voice.setChannel(null);


                message.channel.send(SendErrorEmbed(`You removed ${mentionedUser.username} from your Private Channel!`, "They are now unable to join."))
                console.log(`${mentionedMember.user.username} was removed from ${message.member.user.username}'s Channel.`)
            } else {
                message.channel.send(SendErrorEmbed("You can't do that!", "You need to mention a user to invite them!"))
            }
        } else {
            message.channel.send(SendErrorEmbed("You can't do that!", "You need to be the owner of this channel to invite someone!"))
        }
    }

    if (parts[0] == '++') {

        //sanity check time!
        console.log(`++|${parts[1]}|${parts[2]}|`)
        if (parts[1].length > 24) {
            message.channel.send(SendCorrectUsageEmbed("Channel Name too long!"));
            return
        }
        if (!parts[1]) {
            message.channel.send(SendCorrectUsageEmbed("You need to specify a channel name!"));
            return
        } else {
            if (!parts[2]) {
                message.channel.send(SendCorrectUsageEmbed("You need to specify a user limit!"));
                return
            } else {
                if (parts[3]) {
                    message.channel.send(SendCorrectUsageEmbed("Too many arguements! Maybe you added an extra space?"));
                    return
                }
            }
        }
        //if (Number.isInteger(parts[2]) == false){message.channel.send(SendCorrectUsageEmbed("That's not an integer! You need to specify an integer for the user limit!"));return}

        const host = message.member.user.username
        const channelName = `${parts[1]} | ${host} | ⚙`
        const creationLocation = "805765393732861994"
        const userLimit = parts[2]

        message.member.guild.channels.create(
            channelName, {
                type: 'voice',
                parent_id: creationLocation
            }).then((channel) => {
            channel.setParent(creationLocation);
            channel.updateOverwrite(message.guild.roles.everyone, {
                CONNECT: true,
                SPEAK: true,
                VIEW_CHANNEL: true
            })
            channel.setUserLimit(userLimit)
            message.channel.send(SendSucessEmbed("Channel Creation success!", `You may now join your channel!`))
            console.log(`${host} Created a looking for group post for ${parts[1]} with user limit ${parts[2]}.`)


        })




    }
    })
    

    Client.on('guildMemberAdd', async member => {
        const channel = member.guild.channels.cache.find(ch => ch.name.includes('welcome'));
        if (!channel) return;
        
        // Set a new canvas to the dimensions of 700x250 pixels
	const canvas = Canvas.createCanvas(640, 640);
	// ctx (context) will be used to modify a lot of the canvas

    const ctx = canvas.getContext('2d');
    // Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./sus.png');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    //add text
    ctx.font = '48px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`When ${member.displayName} is sus`, (canvas.width / 2) - (ctx.measureText(`When ${member.displayName} is sus`).width / 2 ) , 600 );

	// Use helpful Attachment class structure to process the file for you
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'welcome-image.png');
    
    channel.send(`Welcome to the server, ${member}!`, attachment);

    
    })




function SendErrorEmbed(title, message) {
    const errorEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor("#FF0000")
        .setTimestamp()
        .setFooter("SvrMgr: Voice Module")
    return errorEmbed
}

function SendSucessEmbed(title, message) {
    const sucessEmbed = new Discord.MessageEmbed()
        .setTitle(title)
        .setDescription(message)
        .setColor("#00FF00")
        .setTimestamp()
        .setFooter("SvrMgr: Voice Module")
    return sucessEmbed
}

function SendCorrectUsageEmbed(reason) {
    const CUEmbed = new Discord.MessageEmbed()
        .setTitle("Incorrect usage!\n Correct usage: \n ++ (Channel Name) (Players Needed)")
        .setDescription(reason)
        .setColor("#FFFF00")
        .addFields({
            name: 'Channel Name',
            value: "Name of the voice channel, limited to 24 characters."
        }, {
            name: 'Players needed',
            value: "An integer value, limited at 99"
        }, {
            name: 'Example Usage',
            value: "++ MC_Bedwars 4 | Would create a channel named MC_Bedwars with a user limit of 4"
        })
        .setTimestamp()
        .setFooter("SvrMgr: Voice Module")
    return CUEmbed
}



Client.login(process.env.TOKEN)