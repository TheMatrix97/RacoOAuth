var schema = require('mongoose').Schema;
var adjunt = require('adjunt');
var notification = new schema({
    titol: String,
    codi_assig: String,
    data_insercio: String,
    data_modificacio: String,
    data_caducitat: String,
    adjunts: [adjunt]
});
module.exports = notification;