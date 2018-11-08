var schema = require('mongoose').Schema;
var token = new schema({
    id: String,
    token: {
        access_token: String,
        token_type: String,
        expires_in: Number,
        refresh_token: String,
        scope: String,
        expires_at: Date
    }
});
module.exports = token;