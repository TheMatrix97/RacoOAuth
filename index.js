const Telegraf = require('telegraf');
const tokenModel = require('./controllers/bdController');
const racoAuth = require('./controllers/AuthController');
const api = require('./controllers/ApiController');
const ip = require('ip');
const bot = new Telegraf(process.env.BOT_TOKEN);


bot.use((ctx, next) => {
    const start = new Date();
    console.log("persona: " + ctx.message.from.id);
    if(ctx.message.from.id !== 316789902) return null;//just for testing todo delete this in prod
    //check has valid token
    private_token(ctx.message.from.id).then(function(token){
        bot.context.token = token;
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
    tokenModel.find({id: ctx.message.from.id},function(err,docs){
        console.log("Find: " + docs);
        if(docs.length === 0){
          ask_token();
        }else{
          ctx.reply("Ya te tengo registrado :3")
        }
    });
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


//no se si este es el mejor sitio para esto...
const private_token = function(id) {
    return new Promise(function (resolve, reject) {
        tokenModel.find({id: id}, async function (err, docs) {
            if (!err && docs.length > 0) {
                let accessToken = racoAuth.accessToken.create(docs[0].token);
                try {
                    if (accessToken.expired()) { //si se ha caducado hay que actualizar
                        accessToken = await accessToken.refresh({
                            client_id: process.env.CLIENT_ID,
                            client_secret: process.env.CLIENT_SECRET
                        });
                        console.log(accessToken);
                        docs[0].updateOne({token: accessToken});
                    }
                }
                catch (error) {
                    console.log('Error refreshing access token: ', error.message);
                }
                resolve(accessToken.token.access_token);
            } else reject();
        });
    });
};

function ask_token(ctx){
    ctx.reply("Autoriza: http://"+ip.address() + ":3000/auth?id="+ctx.message.from.id);
}

bot.startPolling();
