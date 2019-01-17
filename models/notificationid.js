let schema = require('mongoose').Schema;
let notificationid = new schema({
    id: String,
    notifications: []
});
module.exports = notificationid;