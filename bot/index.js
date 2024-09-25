const { Telegraf, Markup } = require("telegraf");
const TOKEN = "7812576129:AAHxLQtfRlX-J5HnkfhED3X-Bx_VHiU_eWA";
const bot = new Telegraf(TOKEN);
const express = require("express");
const app = express()
app.use(express.json())
const web_link = "https://pallavademo.netlify.app";
const community_link = "https://t.me/pallavaempire";


require('dotenv').config();
const admins = [6670354006]; // Replace with actual admin user IDs
const adminPassword = process.env.ADMIN_PASSWORD;

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
    ctx.replyWithMarkdown(`*Hey, ${userName}💞🌟! 
    Welcome to Pallava Empire!🥳

You have the opportunity to Get a build A New empire and make real money!💰

Got Invite friends to compete, join lotteries, and level up faster!🚀.`, {
        reply_markup: {
            inline_keyboard: [
              [{ text: "Join our Community", url: community_link }],
              [{ text: "Help", callback_data: 'help' }],
              [{ text: " 🌟 Play now! 🌟", web_app: { url: urlSent } }]
            ]
            in: true
        },
    });
});

bot.action('help', (ctx) => {
    ctx.reply('What's the goal?

Earn coins, upgrade character, compete with players, and invest! AirDrop is coming soon...👀

🔵Earn
Tap the screen to mine coins. You can never have too many!

🔝Improve
Upgrade your character and it's business to increase passive income and boost your level!

📈Profit per hour
Earn for 3 hours while you are not in the game.

👥Friends
Invite friends to develop empires together! You will earn bonuses for invited friends and their achievements in the game.

⚡️Negotiations
Compete with players and win coins!

📋Quests
Complete simple tasks every day and receive rewards!

🏛Stock Exchange
Invest your coins in various funds to achieve super returns! However, remember that you can either make a profit or lose your deposit.', {
        reply_markup: {
            inline_keyboard: [
                [{ text: "Join our Community", url: community_link }],
                [{ text: "Join our Discussion", url: discussion_link }],
                [{ text: "👋 Start now!", web_app: { url: urlSent } }]
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
                    [{ text: "Dashboard 🤨", web_app: { url: 'https://tap.pallavempire.fun/dashboardAdx/stats' } }],
                    [{ text: "Add/Remove Task", web_app: { url: 'https://tap.pallavempire/dashboardAdx/managetasks' } }],
                    [{ text: "Statics 📇", web_app: { url: 'https://tap.pallavempire.fun/dashboardAdx/stats' } }]
                ]
            }
        });
    } else {
        ctx.reply('Hey Who The Hell Are You Go Back Now Or I Will Kill You 🤨🤨');
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
