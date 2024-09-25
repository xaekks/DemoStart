const { Telegraf, Markup } = require("telegraf");
const TOKEN = "7812576129:AAHxLQtfRlX-J5HnkfhED3X-Bx_VHiU_eWA";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://pallavademo.netlify.app";
const community_link = "https://t.me/pallavempire";


require('dotenv').config();
const admins = [6670354006]; // Replace with actual admin user IDs
const adminPassword = process.env.ADMIN_PASSWORD;
const inlineButton1 = process.env.INLINE_BUTTON_1;
const inlineButton2 = process.env.INLINE_BUTTON_2;
const inlineButton3 = process.env.INLINE_BUTTON_3;
const helpButton1 = process.env.HELP_BUTTON_1;
const helpButton2 = process.env.HELP_BUTTON_2;
const helpButton3 = process.env.HELP_BUTTON_3;

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});
const db = admin.firestore();
let loggedInAdmins = [];

bot.start((ctx) => {
    const startPayload = ctx.startPayload;
    const urlSent = `${web_link}?ref=${startPayload}`;
    const user = ctx.message.from;
    const userName = user.username ? `@${user.username}` : user.first_name;
    ctx.replyWithMarkdown(`*Hey, ${userName}! I am @psllvabot , Welcome to CDPTap!*
Mine CDPTap cryptocurrency easily and earn CDPtap tokens.

Start mining now and be among the biggest players earning CDPtap tokens daily.

Got friends, relatives, co-workers?
Bring them all into the game.
More squad power, more CDPtap tokens.`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "👋 Start now!", web_app: { url: urlSent } }],
              [{ text: "Join our Community", url: community_link }],
              [{ text: "Help", callback_data: 'help' }]
            
            ],
            in: true
        },
    });
});

bot.action('help', (ctx) => {
    ctx.reply('This is the help message. Here you can provide information about how to use the bot.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: helpButton1, callback_data: 'help_button1' }],
                [{ text: helpButton2, callback_data: 'help_button2' }],
                [{ text: helpButton3, callback_data: 'help_button3' }]
            ]
        }
    });
});

bot.command('login', (ctx) => {
    const userId = ctx.message.from.id;
    const messageParts = ctx.message.text.split(' ');
    const password = messageParts[1];
    if (admins.includes(userId) && password === adminPassword) {
        loggedInAdmins.push(userId);
        ctx.reply('You are now logged in as admin.', {
            reply_markup: {
                inline_keyboard: [
                    [{ text: inlineButton1, callback_data: 'button1' }],
                    [{ text: inlineButton2, callback_data: 'button2' }],
                    [{ text: inlineButton3, callback_data: 'button3' }]
                ]
            }
        });
    } else {
        ctx.reply('You are not authorized to use this command or the password is incorrect.');
    }
});

bot.command('logout', (ctx) => {
    const userId = ctx.message.from.id;
    if (loggedInAdmins.includes(userId)) {
        loggedInAdmins = loggedInAdmins.filter(id => id !== userId);
        ctx.reply('You have been logged out.');
    } else {
        ctx.reply('You are not logged in as admin.');
    }
});

bot.command('broadcast', (ctx) => {
    const userId = ctx.message.from.id;
    if (loggedInAdmins.includes(userId)) {
        const message = ctx.message.text.split(' ').slice(1).join(' ');
        if (message) {
            // Fetch users from Firebase
            db.collection('users').get().then((snapshot) => {
                snapshot.forEach((doc) => {
                    const user = doc.data();
                    const chatId = user.chatId; // Assuming user document has a chatId field
                    bot.telegram.sendMessage(chatId, message);
                });
                ctx.reply('Broadcast message sent.');
            }).catch((error) => {
                console.error('Error fetching users:', error);
                ctx.reply('Failed to send broadcast message.');
            });
        } else {
            ctx.reply('Please provide a message to broadcast.');
        }
    } else {
        ctx.reply('You are not authorized to use this command.');
    }
});

bot.launch();
  
app.listen(3000, () => {
    console.log("server is me and now running")
})
