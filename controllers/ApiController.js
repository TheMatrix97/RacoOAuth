var Client = require('node-rest-client').Client;
var client = new Client();
const server = "https://api.fib.upc.edu";

const aux = {
    getData: function(client_id){
        return new Promise(function(resolve,reject){
            var args = {
                headers: {"Authorization": "Bearer " + client_id}
            };
            client.get(server+"/v2/jo.json",args,function(data,response){
                console.log(response.statusCode);
                if(response.statusCode === 200){
                    return resolve(data);
                }else{
                    console.log("error api" + response.statusCode);
                    reject(response.statusCode);
                }
            })
        });
    },

    getFoto: function(client_id){
        return new Promise(function(resolve,reject){
            var args = {
                headers: {"Authorization": "Bearer " + client_id}
            };
            client.get(server+"/v2/jo/foto.jpg",args,function(data,response){
                console.log(response.statusCode);
                if(response.statusCode === 200){
                    return resolve(data);
                }else{
                    console.log("error api" + response.statusCode);
                    reject(response.statusCode);
                }
            })
        });
    },

    getAvisos: function(client_id){
        return new Promise(function(resolve,reject){
            var args = {
                headers: {"Authorization": "Bearer " + client_id}
            };
            client.get(server+"/v2/jo/avisos.json",args,function(data,response){
                console.log(response.statusCode);
                if(response.statusCode === 200){
                    return resolve(data);
                }else{
                    console.log("error api" + response.statusCode);
                    reject(response.statusCode);
                }
            })
        });
    }


};
module.exports = aux;