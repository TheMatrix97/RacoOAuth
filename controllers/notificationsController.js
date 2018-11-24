const api = require('./ApiController');
const users = require('./AuthController');
const db = require('./bdController');
const schemaNotification = require('../models/notificationid');
const NotificationidModel = db.model('Notificationid', schemaNotification);

const search_notification = function(id){
  NotificationidModel.find({id: id}, async function (err, docs){
      if (err){
          console.log(err);
          return;
      }
      users.private_token(id).then(function(token){
          if (docs.length <= 0) { //aun no tengo tus avisos, user nuevo
            api.getAvisos(token).then(function(data){
                let notifications = new NotificationidModel({id: id, notifications: data.results});
                notifications.save().then(function(){
                    console.log("guardadas notificaciones de " + id);
                });
            });
          }
      });
  });
};

function check_new_notifications(){
    //for each user in DB
    users.get_all_users().then(function(ids){
        ids.forEach(search_notification);
    });
}

//setInterval(check_new_notifications,300000);
check_new_notifications();
