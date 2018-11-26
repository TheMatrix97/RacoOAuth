'use strict';
//Contiene el codigo del servidor express que se encarga de pedir el token y guardarlo a la BD, workflow oauth2

const simpleOauthModule = require('simple-oauth2');
const express = require('express');
const db = require('./bdController');
const schemaToken = require('../models/token');
const schemaNotification = require('../models/notificationid');
const tokenModel = db.model('Token', schemaToken);
const notificacionModel = db.model('notificationid',schemaNotification);
const app = express();

const oauth2 = simpleOauthModule.create({
    client: {
        id: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET,
    },
    auth: {
        tokenHost: 'https://api.fib.upc.edu',
        tokenPath: '/v2/o/token',
        authorizePath: '/v2/o/authorize',
    },
});

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.URL+'/callback',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    console.log("id: " + req.query.id);
    tokenModel.find({id: req.query.id},function(err,docs){
        console.log("Find: " + docs);
        if(docs.length === 0){
            res.redirect(authorizationUri+"?id="+req.query.id);
        }else{
            res.send("Ya te tengo registrado...");
        }
    });
});

app.get('/ping',(req,res) =>{
    res.send("pong");
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
    const code = req.query.code;
const options = {
    code: code, //authorization code
    redirect_uri: process.env.URL + '/callback?id=' + req.query.id, //el id tiene que ser el mismo que nos llega a la peticion
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
};

try {
    const id = req.query.id;
    const result = await oauth2.authorizationCode.getToken(options);
    var ms = new Date().getTime();
    result.expires_at = new Date(((result.expires_in - 100)*1000) + ms);
    console.log('The resulting token: ', result);

   // const token = oauth2.accessToken.create(result);
    //guardar token en bd
    console.log("voy a guardar a " + id);
    let t = new tokenModel({id: id , token: result }); //id del pavo que ha dicho start
    t.save().then(function(){
        console.log("guardado");
        return res.send("Se ha autenticado correctamente");
    });

} catch(error) {
    console.error('Access Token Error', error.message);
    return res.status(500).json('Authentication failed');
}
});

//no se si este es el mejor sitio para esto...
const private_token = function(id) {
    return new Promise(function (resolve, reject) {
        tokenModel.find({id: id}, async function (err, docs) {
            if (!err && docs.length > 0) {
                let accessToken = oauth2.accessToken.create(docs[0].token);
                try {
                    if (accessToken.expired()) { //si se ha caducado hay que actualizar
                        accessToken = await accessToken.refresh({
                            client_id: process.env.CLIENT_ID,
                            client_secret: process.env.CLIENT_SECRET
                        });
                        console.log(accessToken);
                        let token = docs[0];
                        token.token = accessToken.token;
                        token.save(function (err, item) {
                            if (err) throw err;
                            resolve(item.token.access_token);
                        });
                    }else resolve(accessToken.token.access_token);
                }
                catch (error) {
                    //Muy probablemente la persona me ha revocado el token, si el error es 401, elimino all  que tengo de la persona
                    console.log('Error refreshing access token: ', error.message);
                    reject();
                }
            } else reject();
        });
    });
};

const get_all_users = function () {
  return new Promise(function(resolve,reject){
    tokenModel.find({}, async function (err,docs) {
        let ids = [];
        docs.forEach(function(item){
            ids.push(item.id);
        });
        resolve(ids);
    });
  });
};

const delete_token = function (id) {
    //ya te conozco asi que voy a borrar el token que tengo (que seguro k es invalido)
    tokenModel.remove({id: id},function (err) {
        if (err) console.log(err);
    }).then(function(){
        notificacionModel.remove({id: id},function (err) {
            if (err) console.log(err);
        });
    });
};

let port=Number(process.env.PORT || 3000);
app.listen(port, () => console.log('App listening on port ' + port));
module.exports.private_token = private_token;
module.exports.get_all_users = get_all_users;
module.exports.delete_token = delete_token;