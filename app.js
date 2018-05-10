//====================CODING THE PACKAGE====================
var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');




//====================MUSIC BOT COMMANDS====================
//npm i ytdl-core; npm i request; npm i fs; npm i get-youtube-id; npm i youtube-info
//npm i node-opus ytdl-core
//npm i ffmpeg-binaries
//npm i quick.hook
const { TOKEN, PREFIX } = require('./config');
const ytdl = require('ytdl-core');
const queue = new Map();

bot.on('warn', console.warn);
bot.on('error', console.error);


bot.on('message', async msg => {
    if (msg.author.bot) return undefined;
    if (!msg.content.startsWith(PREFIX)) return undefined;
    const args = msg.content.split(' ');
    const serverQueue = queue.get(msg.guild.id);
    
    if (msg.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('Vous devez être connecté(e) à un channel vocal pour écouter de la musique.');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            return msg.channel.send('Je ne peux pas me connecter à ce channel, assurez vous que j\'en possède les droits.');
        }
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('Je ne peux pas parler dans ce channel, assurez vous que j\'en possède les droits.');
        }

        const songInfo = await ytdl.getInfo(args[1]);
        const song = {
            title: songInfo.title,
            url: songInfo.video_url
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
            queue.set(msg.guild.id, queueConstruct);

            queueConstruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueConstruct.connection = connection;
                play(msg.guild, queueConstruct.songs[0]);
            }   catch (error) {
                console.log(`Je ne peux pas rejoindre le channel vocal: ${error}`);
                queue.delete(msg.guild.id);
                return msg.channel.send(`Je ne peux pas rejoindre le channel vocal: ${error}`);
            }
        } else {
            serverQueue.songs.push(song);
            return msg.channel.send(`**${song.title}** a été ajoutée à la Queue !`);
        }

        return undefined;
    } else if (msg.content.startsWith(`${PREFIX}stop`)) {
        if (!msg.member.voiceChannel) return msg.channel.send('Vous n\'êtes pas dans un channel vocal.');
        msg.member.voiceChannel.leave();
        return undefined;
    }
});

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return; 
    }

    const dispatcher = connection.playStream(ytdl(song.url))
        .on('end', () => {
           console.log('song ended');
           serverQueue.songs.shift();
           play(guild, serverQueue.songs[0]);
        })
        .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(2 / 2);
}

function random(min, max) {
    min = Math.ceil(0);
    max = Math.floor(3);
    randnum = Math.floor(Math.random() * (max - min +1) + min);
}



//second lets call the file we just made using fs
var userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));
var commandsList = fs.readFileSync('Storage/commands.txt', 'utf8');

//if(message === `${PREFIX}openslot`) {

//    let embed = new Discord.RichEmbed()
//        .setColor("#1bc643")
//        .setTitle("Sucessfully opened slot for PREMIUM RANK!")
//        .addField("Created At", message.author.createdAt)

//        .setDescription("SYSTEM");

//    message.channel.sendMessage(embed);
//    channel.setName('Reserved_Slot')
//}




//====================CHANNEL: JOIN/LEAVE THE SERVER====================
bot.on('guildMemberAdd', member => {
    member.guild.channels.get('438815813231706112').setName(`Total Users | ${member.guild.memberCount}`);
});

bot.on('guildMemberRemove', member => {
    member.guild.channels.get('438815813231706112').setName(`Total Users | ${member.guild.memberCount}`);
});










//====================MESSAGE COMMANDS===================
bot.on('message', message => {

    //variables
    var sender = message.author; //the person who send message
    var msg = message.content.toUpperCase(); //takes the message and makes it all uppercase
    var prefix = '§'

    //first, we need to make sure that isn't reading a message that the bot is sending
    if(sender.id === '438480476286484482') { //check if the ID of the sender is the same ID as the bot
        return; //cancels the rest of the listener event
    }

    //====================PECE AND PEBE COMMANDS====================
    if (msg == prefix + 'BNPB') {
        message.delete();
        message.channel.send({embed: {
            title: "Bonne Nuit le Meilleur, @PéBé#3089 ❤",
            color: 0x17A589,
        }})
    }

    if (msg == prefix + 'BNPC') {
        message.delete();
        message.channel.send({embed: {
            title: "Bonne Nuit le Meilleur, @PéCé#3451 ❤",
            color: 0x17A589,
        }})
    }



    //====================OTHER COMMANDS====================
    if (msg == prefix + 'BNEVA') {
        message.delete();
        message.channel.send({embed: {
            title: "NIQUE TOI EVA 💩",
            color: 0x804C00,
        }})
    }

    if (msg == prefix + 'PLAYGAME') {
        random();

        if (randnum == 1) {
            message.channel.send("**Let's go to League Of Legends**")
        }
        if (randnum == 2) {
            message.channel.send("**Let's go to Fortnite**")
        }
        if (randnum == 3) {
            message.channel.send("**Let's go to CSGO**")
        }
    }

    



    //====================HELP COMMAND====================
    if (msg == prefix + 'HELP') {
        message.channel.send({embed: {
            title: "📋 __COMMANDS:__",
            description: "The commands you can use.",
            url: "",
            color: 0x17A589,
        }})
        message.channel.send({embed: {
            title: "🎵 Music Commands:",
            description: "**§play [url]**    To play a music. \n**§stop**        To stop a music.",
            url: "",
            color: 0x9E00F9,
        }})
        message.channel.send({embed: {
            title: "👤 User Commands:",
            description: "**§userstats**    To know how many messages you have sent.",
            url: "",
            color: 0xEBFF00,
        }})
    }




    //====================PING PONG COMMANDS====================
    if (msg === 'EMMA') {
        message.channel.send('CARENA')
    }











    


    //====================BAD WORDS====================
    if (msg.includes('marceau')) {
        message.delete();
        message.author.send('Le mot *marceau* est banni, ne l\'utilisez pas !');
    }







    //calling it is pretty easy
    if (msg === prefix + 'USERSTATS') {
        message.channel.send({embed: {
            title: 'You sent **' + userData[sender.id].messagesSent + '** messages !',
            color: 0xEBFF00,
        }});        
    }

    //now lets make sur their username is tere before writting to the file
    if (!userData[sender.id]) userData[sender.id] = {
        messagesSent: 0
    }

    //now lets increase messages and write to the final file
    userData[sender.id].messagesSent++; //this adds one to 'messageSent', under the user

    //to save the file we have to write this
    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    });   
});




//====================SETGAME ACTIVITY====================
bot.on('ready', () => {
    console.log('Bot launched...');
    bot.user.setGame('Pierre', 'https://www.twitch.tv/pecetueur')
})




//====================REJOIN AND LEAVE DISCORD MESSAGE====================
//listener event: user joining the discord server
bot.on('guildMemberAdd', member => {
    console.log('L\'ami(e) ' + member.user.username + ' nous a rejoins, bienvenu(e) à toi !')
    console.log(member)

    //now let's add a role when they join. first we need to get the role we want
    var role = member.guild.roles.find('name', 'Joueur'); //this looks for the role in the server(guild), it searches by name, meaning you can change 'JOUEUR' to the sole you want

    //secondly we will add the role
    member.addRole(role)

    //sending a message to a channel when a user joins discord
    member.guild.channels.get('443183190090186752').send({embed: {
        title: member.user.username + '** has joined the server !**',
        color: 0x00FF17,
        timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
            }
    }});
});

//listener event: user leaving the discord server
bot.on('guildMemberRemove', member => {

    //sending a message to a channel when a user left discord
    member.guild.channels.get('443183190090186752').send({embed: {
        title: member.user.username + '** has left the server !**',
        color: 0xFF0000,
        timestamp: new Date(),
            footer: {
                icon_url: bot.user.avatarURL,
                text: bot.user.username
            }
    }});
});




//====================LOGIN====================
bot.login('NDM4ODM3Nzc0Mjg4NjgzMDEw.DcKbCg.3dq25LrW3modQIlnaR4a9i1GzX0')