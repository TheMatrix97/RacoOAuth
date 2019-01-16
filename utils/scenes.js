const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const session = require('telegraf/session');
const api = require('../controllers/ApiController');
const stage = new Stage();

module.exports = function(bot){
    bot.use(session());
    bot.use(stage.middleware());
    loadAssigsScene();
};

function loadAssigsScene(){
    const assigs = new Scene('assigs');
    assigs.enter((ctx) => ctx.reply('Envia las asignaturas en una sola línea separadas por un espacio'));
    assigs.on('message', (ctx) => {
        api.getPlacesLliures().then(function(res){
            let data = generateDataPlacesLliures(res, ctx.message.text.split(" "));
            ctx.replyWithHTML(generateHtml(data));

        }, function(err){ //error al pillar el token
            ctx.reply("error api");
        });
        ctx.scene.leave();
    });
    stage.register(assigs);
}


function generateDataPlacesLliures(res, assg) {
    let r = [];
    assg = assg.map(function(e) {
        e = e.toUpperCase();
        return e;
    });
    res.results.forEach(function(item){
       if(assg.includes(item.assig)){
           if(r[item.assig] === undefined){
               r[item.assig] = [];
           }
           r[item.assig].push(item);
       }
    });
    return r;
}

function generateHtml(data){
    let res = "";
    for (let key in data) {
        if(Array.isArray(data[key])){
            res += '<b>'+ key +':</b>\n';
        }
    }
    return res;
}
