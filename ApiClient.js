var Client = require('node-rest-client').Client;
var client = new Client();

const aux = {
    getData: function(client_id){
        return new Promise(function(resolve,reject){
            var args = {
                headers: {"Authorization": "Bearer " + client_id}
            };
            client.get("https://api.fib.upc.edu/v2/jo.json",args,function(data,response){
                if(response.statusCode === 200){
                    return resolve(data);
                }else reject(response.statusCode);
            })
        });
    },


};
module.exports = aux;