'use strict';

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
    redirect_uri: 'http://localhost:3000/callback',
});

// Initial page redirecting to Github
app.get('/auth', (req, res) => {
    console.log(authorizationUri);
    console.log("id: " + req.query.id);
res.redirect(authorizationUri+"?id="+req.query.id);
});

// Callback service parsing the authorization token and asking for the access token
app.get('/callback', async (req, res) => {
    const code = req.query.code;
const options = {
    code: code,
    redirect_uri: 'http://localhost:3000/callback?id=' + req.query.id, //el id tiene que ser el mismo que nos llega a la peticion
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
};

try {
    const id = req.query.id;
    const result = await oauth2.authorizationCode.getToken(options);

    console.log('The resulting token: ', result);

   // const token = oauth2.accessToken.create(result);
    //guardar token en bd
    console.log("voy a guardar a " + id);
    let t = new tokenModel({id: id , token: result }); //id del pavo que ha dicho start
    t.save().then(function(){
        console.log("guardado");
        return res.status(200).json(result);
    });

} catch(error) {
    console.error('Access Token Error', error.message);
    return res.status(500).json('Authentication failed');
}
});


app.listen(3000, () => console.log('App listening on port 3000!'));
module.exports = oauth2;