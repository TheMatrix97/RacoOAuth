const Telegraf = require('telegraf');
const tokenModel = require('./bdController');
const racoAuth = require('./racoAuth');
const api = require('./ApiClient');
const ip = require('ip');
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use((ctx, next) => {
    const start = new Date();
    console.log("persona: " + ctx.message.from.id);
    if(ctx.message.from.id !== 316789902) return null;
    return next(ctx).then(() => {
        const ms = new Date() - start;
        console.log('Response time %sms', ms);
    })
});
bot.start(ctx => {
    tokenModel.find({id: ctx.message.from.id},function(err,docs){
        console.log("Find: " + docs);
        if(docs.length === 0){
          ctx.reply("Autoriza: http://"+ip.address() + ":3000/auth?id="+ctx.message.from.id);
        }else{
          ctx.reply("Ya te tengo registrado :3")
        }
    });
});

bot.hears('/data', (ctx) => {
    private_token(ctx.message.from.id,function(token){
        api.getData(token).then(function(res){
            console.log(res);
            ctx.reply("Nom: " + res.nom + " " + res.cognoms + "\nEmail: " + res.email);
        });
    });
});

const private_token = function(id,callback){
  tokenModel.find({id: id}, function(err,docs){
      if(!err && docs.length > 0){
          return callback(docs[0].token.access_token);
      }
  })
};

bot.startPolling();
