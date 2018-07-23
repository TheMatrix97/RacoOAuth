const Telegraf = require('telegraf');
const racoAuth = require('./racoAuth');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use((ctx, next) => {
    const start = new Date()
    console.log("persona: " + ctx.message.from.id);
    if(ctx.message.from.id !== 316789902) return null;
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms);
    })
});
bot.start((ctx) => ctx.reply('Welcome'));


bot.startPolling();
