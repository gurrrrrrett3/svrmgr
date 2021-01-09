const Discord = require('discord.js');
const fs = require('fs');
const jsonfile = require('jsonfile');
const dotenv = require('dotenv');
dotenv.config();

const Client = new Discord.Client();


Client.on("message", (message) =>  {


    const content = message.content.toLowerCase()

    if (content.includes("masterbate") || content.includes("masterbation")) {

        message.channel.send("I’m not dumb to not know that  Im 19")
    }
})
   
Client.login('Nzc5OTA0Njc2ODc5MDA3NzQ0.X7nU1A.J7_kWN-UNxB6Ha4O40ngWC-1E_k')