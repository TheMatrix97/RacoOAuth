const api = require('./ApiController');
const users = require('./AuthController');
const db = require('./bdController');
const schemaNotification = require('../models/notificationid');
const NotificationidModel = db.model('Notificationid', schemaNotification);

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
                  console.log(diferences);

              }
              else {
                  console.log("Error al actualizar las notificaciones");
              }
          });
      });
  });
};

function compare(data_from_db, data_from_api){
    //TODO change orden, data_from_api.filter(!data_from_db), ara esta en mode testing
    return data_from_db
        .filter(x => !data_from_api.containsNotification(x));
}

function notify_user(id, notification){
    if(id === "316789902") {
        bot.telegram.sendMessage(id, "Tienes un nuevo aviso! (Si eres lluis me puedes comer los huevos)");
    }
}

const check_new_notifications = function (bot_i){
    //for each user in DB
    bot = bot_i;
    users.get_all_users().then(function(ids){
        ids.forEach(search_notification);
    });
};

//setInterval(check_new_notifications,300000);
module.exports = check_new_notifications;
