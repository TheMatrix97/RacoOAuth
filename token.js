var schema = require('mongoose').Schema;
var token = new schema({
    id: String,
    token: String,
});
module.exports = token;