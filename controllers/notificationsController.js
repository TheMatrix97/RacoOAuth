
const db = require('./bdController');
const schemaNotification = require('../models/notification');
const NotificationModel = db.model('Notification', schemaNotification);

function check_new_notifications(){

}

setInterval(check_new_notifications,300000);
