const api = require('./ApiController');
const users = require('./AuthController');
const db = require('./bdController');
const schemaNotification = require('../models/notificationid');
const NotificationidModel = db.model('Notificationid', schemaNotification);
const extra = require('telegraf/extra');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

let bot = null;

Array.prototype.containsNotification = function(element){
    return JSON.stringify(this).indexOf(JSON.stringify(element)) > -1;
};

const search_notification = function(id){
    //notify_user(id);
  NotificationidModel.find({id: id}, async function (err, docs){
      if (err){
          console.log(err);
          return;
      }
      users.private_token(id).then(function(token){
          api.getAvisos(token).then(async function (data) {
              if (docs.length === 0) {
                  let notifications = new NotificationidModel({id: id, notifications: data.results});
                  notifications.save().then(function () {
                      console.log("guardadas notificaciones de " + id);
                  });
              } else if (docs.length === 1) {
                  let diferences = await compare(docs[0].notifications, data.results);
                  notify_user(id, diferences);
                  //update
                  if(diferences.length > 0) {
                      docs[0].notifications = data.results;
                      docs[0].save(function (err) {
                          if (err) console.log("error al actualizar el las notificaciones");
                          else console.log("He actualizado las notificaciones de " + id);
                      });
                  }
              }
              else {
                  console.log("Error al actualizar las notificaciones");
              }
          }, function(err){
              console.log("Hay un error con el token de " + id + " voy a volver a pedir -> " + err);
              if(err == 401) bot.telegram.sendMessage(id, "No he podido acceder a tus avisos, porfavor vuelve a darme autorización :S\n" + "Autoriza: "+process.env.URL+"/auth?id="+id);
          });
      });
  });
};

function compare(data_from_db, data_from_api){
    return data_from_api
        .filter(x => !data_from_db.containsNotification(x));
}

function notify_user(id, notifications){
    notifications.forEach(function(item){
        console.log("Notifico al user " + id);
        bot.telegram.sendMessage(id, genera_avis(item), extra.HTML());
    });
}

function genera_avis(item){
    let res = `⭐Tens un nou avís al racó!⭐
<b>Assignatura:</b> ${item.codi_assig}
<b>Titol:</b> ${item.titol}
<b>Text:</b> ${item.text}`;
    let reg = /<(?!\/?(b|strong|i|a|code|pre)(?=>|\s.*>))\/?.*?>/g;
    return  entities.decode(res.replace(reg,""));
}

const check_new_notifications = function (){
    //for each user in DB
    console.log("Vamos a revisar las notificaciones");
    users.get_all_users().then(function(ids){
        ids.forEach(search_notification);
    });
};

function run(bot_i){
    bot = bot_i;
    setInterval(check_new_notifications, 300000);
    console.log("Intervalo notificaciones configurado");
}

module.exports.run = run;
