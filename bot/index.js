const { Telegraf, Markup } = require("telegraf");
const TOKEN = "7268468934:AAEHokCX4slK7cIy3mr-1KFGxjoSGnf8ky8";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://gojotap.netlify.app";
const community_link = "https://t.me/kissudev";

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`*Hey, ${userName}! Welcome to CEXP Tap!*
CEXP Token will launch soon on Ton.

Start mining now and be among the biggest players earning CEXP tokens daily.

Got friends, relatives, co-workers?
Bring them all into the game.
More squad power, more CDPtap tokens.`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "👋 Start now!", web_app: { url: urlSent } }],
              [{ text: "Join our Community", url: community_link }]
             
            ],
            in: true
        },
    });
  });

  
  bot.launch();
  
app.listen(3000, () => {
    console.log("server is me and now running")
})
