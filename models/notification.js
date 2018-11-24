var schema = require('mongoose').Schema;
var notification = new schema({
    titol: String,
    codi_assig: String,
    data_insercio: Date,
    data_modificacio: Date,
    //todo no fem cas dels adjunts, posible millora (enviar adjunts)
});
module.exports = notification;