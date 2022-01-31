const http = require("http");
const fs = require('fs');
const { exec } = require('child_process');
const Encoding = require('encoding-japanese');
const nodeHtmlToImage = require("node-html-to-image");
const querystring = require("querystring");
const discord = require("discord.js");
const { Client, Intents, MessageEmbed } = require("discord.js");
const options = { intents: ["GUILDS", "GUILD_MESSAGES"] };

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

var token = "OTE3OTE2NjMwNjY5OTg3ODYx.Ya_qeg.zjKfzNE5LQDH-Wi8zcimyN_sm2s";

client.on("ready", () => {
        console.log("Bot準備完了～");
        client.user.setActivity("とぴ。の行動", {
        type: "WATCHING",
    });
});

client.on("guildMemberAdd", member => {
    console.log(`${member.guild.name} に ${member.displayName} が参加しました`);
});

client.on("guildMemberRemove", member => {
    console.log(`${member.guild.name} から ${member.displayName} が退出しました`);
});

client.on("messageCreate", async message => {
    try {
        if (message.author.bot) {
            return;
        }
        if (message.mentions.has(client.user)) {
            /*
            message.reply("呼びましたか?");
            client.users.cache.get('732893750778527764').send('メッセージ');
            */
            var msg = message.content.replace(/<@!917916630669987861>/g, "");
            exec(msg, { encoding: 'Shift_JIS' }, (err, stdout, stderr) => {
                if (err) {
                    message.channel.send("```" + `${toString(stderr)}` + "```");
                    console.log(`${toString(stderr)}`);
                    return;
                }
                const toString = (bytes) => {
                    return Encoding.convert(bytes, {
                        from: 'SJIS',
                        to: 'UNICODE',
                        type: 'string',
                    });
                };
                message.channel.send("```" + `${toString(stdout)}` + "```");
                console.log(`${toString(stdout)}`);
            });
        }
        if (message.content.match("t-web_image")) {
            var html_file = "test.html";
            /*
            var url = "http://duckduckgo.com/?q=test"
            var savepath = "test.html"
            var outfile = fs.createWriteStream(savepath);
            http.get(url, function(res) {
                res.pipe(outfile);
                res.on('end', function (){
                    outfile.close();
                    console.log("ok");
                });
            });
            var data = '<iframe src="https://duckduckgo.com/?q=test" width="100%" height="200"></iframe>';
            fs.writeFile(html_file, data, (err) => {
                if (err) throw err;
                console.log('正常に書き込みが完了しました');
            });*/
            var text = fs.readFileSync(html_file, 'utf8');
            var lines = text.toString().split('¥n');
            var html_ = lines.join('');
            
            nodeHtmlToImage({
                output: "./image.png",
                html: html_
            }).then(() => console.log("The image was created successfully!"));
        }
    } catch (error) {
        const embed = new MessageEmbed()
            .setTitle("なんと！予期せぬエラーが発生しました！どんまい！")
            .setColor("#03A9F4")
            .addField("詳細：", "Error details: " + error)
            .setTimestamp();
        message.channel.send({ embeds: [embed] });
    }
});

client.login(token);