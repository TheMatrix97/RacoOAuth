let schema = require('mongoose').Schema;
let notification = require('notification');
let notificationid = new schema({
    id: String,
    notifications: [notification]
});
module.exports = notificationid;