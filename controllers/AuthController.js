'use strict';
//Contiene el codigo del servidor express que se encarga de pedir el token y guardarlo a la BD, workflow oauth2

const simpleOauthModule = require('simple-oauth2');
const express = require('express');
const tokenModel = require('./bdController');
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

var port=Number(process.env.PORT || 3000);
app.listen(port, () => console.log('App listening on port ' + port));
module.exports = oauth2;