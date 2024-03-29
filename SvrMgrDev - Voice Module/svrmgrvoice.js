const Discord = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const Client = new Discord.Client();

console.log("Voice Module Starting...");

Client.on("ready", () => console.log('Voice Module Ready!')); //bot init complete

Client.on('voiceStateUpdate', (oldState, newState) => {


    if (oldState.channel == null || (oldState.channel != null && newState.channel != null)) {
        //deletes channel if moved out of private channel
        if (oldState.channel != null) {
            if (oldState.channel.members.size == 0 && oldState.channel.name.includes("⚙")) {
                oldState.channel.delete()
            }
        }
        // User Joins a voice channel

        // check for bot
        if (oldState.member.user.bot) return;
        //check if member joined the create channel
        if (newState.channel == null) {
            return
        } else {

            const privateChannels = ["793323614350082078"]
            const creationLocation = "793323272024358912"

            if (privateChannels.includes(newState.channel.id)) {
                //Create Channel
                newState.guild.channels.create(
                    `${newState.member.user.username}'s private channel | ⚙`, {
                        type: 'voice',
                        parent_id: creationLocation

                    }).then((channel) => {
                    channel.setParent(creationLocation);
                    newState.member.voice.setChannel(channel)
                })


            } else return

        }

    } else if (newState.channel == null) {

        // User leaves a voice channel

        if (oldState.channel.members.size == 0 && oldState.channel.name.includes("⚙")) {
            oldState.channel.delete()
        }

    }



})


//Commands

Client.on('message', (message) => {

    if (message.author.bot) return;

    const parts = message.content.split(' ')
    if (parts[0] == '+') {

        //sanity checks

        if (message.member.voice.channel.name.includes(message.member.user.username)) { //user owns channel
            if (message.mentions.users.size) { //user mentioned someone

                if (!message.member.voice.channel) {
                    message.channel.send(SendErrorEmbed("You can't do that!", "You need to be in a voice channel first!"))
                }


                const ownedChannel = message.member.voice.channel
                const mentionedUser = message.mentions.users.first()
                ownedChannel.updateOverwrite(mentionedUser, {
                    CONNECT: true,
                    SPEAK: true,
                    VIEW_CHANNEL: true
                })

                message.channel.send(SendSucessEmbed(`You invited ${mentionedUser.username} to your Private Channel!`, "They are now able to join, be sure to let them know!"))

            } else {
                message.channel.send(SendErrorEmbed("You can't do that!", "You need to mention a user to invite them!"))
            }
        } else {
            message.channel.send(SendErrorEmbed("You can't do that!", "You need to be the owner of this channel to invite someone!"))
        }
    }

    if (parts[0] == '-') {

        //sanity checks

        if (message.member.voice.channel.name.includes(message.member.user.username)) { //user owns channel
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
        const creationLocation = "793323077411799040"
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


        })




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
    return CUEmbed
}




Client.login(process.env.TOKEN)