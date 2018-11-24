require('./controllers/notificationsController');
const Telegraf = require('telegraf');
const racoAuth = require('./controllers/AuthController');
const api = require('./controllers/ApiController');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.context.token = null;
bot.use((ctx, next) => {
    const start = new Date();
    console.log("persona: " + ctx.message.from.id);
   // if(ctx.message.from.id !== 316789902) return null;//just for testing todo delete this in prod
    //check has valid token
    racoAuth.private_token(ctx.message.from.id).then(function(token){
        ctx.token = token;
        return next(ctx).then(() => {
            const ms = new Date() - start;
            console.log('Response time %sms', ms);
        })
    }, function(){
        console.log("no tengo el token, asking...");
        ask_token(ctx);
        return null;
    });
});

bot.start(ctx => {
    ctx.reply("Todo esta listo! A partir de ahora te tendré al tanto de los nuevos avisos en el racó ;)");
});

bot.hears('/data', (ctx) => {
    console.log(ctx.token);
    api.getData(ctx.token).then(function(res){
        console.log(res);
        ctx.reply("Nom: " + res.nom + " " + res.cognoms + "\nEmail: " + res.email);
    }, function(err){ //error al pillar el token
        ask_token(ctx);
    });
});

bot.hears('/foto', (ctx) => {
    api.getFoto(ctx.token).then(function(res){
        ctx.replyWithPhoto({
            source: Buffer.from(res)
        });
    });
});


function ask_token(ctx){
    ctx.reply("Autoriza: "+process.env.URL+"/auth?id="+ctx.message.from.id);
}



bot.startPolling();
