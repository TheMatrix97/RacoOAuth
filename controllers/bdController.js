const moongose = require('mongoose');
const schemaToken = require('../models/token.js');
console.log("conectando mongo");
moongose.connect('mongodb://'+process.env.DOCKER_MACHINE_IP+':'+process.env.MONGO_PORT+'/oauth',{ useNewUrlParser: true },function(err){
    if(err){
        console.log(err);
        console.log("err mongo");
    }
    else console.log("conectado mongo");
});
const token =  moongose.model('Token', schemaToken);
module.exports =  token;