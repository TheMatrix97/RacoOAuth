var schema = require('mongoose').Schema;
var adjunt = new schema({
    tipus_mime: String,
    nom: String,
    url: String,
    data_modificacio: String,
    mida: Number
    //todo no fem cas dels adjunts, posible millora (enviar adjunts)
});
module.exports = adjunt;