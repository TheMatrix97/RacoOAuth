# Bot iFIB
Bot que ofrece una interfaz via oauth 2 con la api de la fib: https://api.fib.upc.edu/v2
## Features
- Polling cada 5 minutos de los avisos del racó, si hay alguno nuevo se envia un mensaje al destinatario (auto)
- Consulta de datos de la api privada (/data, /foto)
- Consulta de las plazas libres por assignaturas (/placeslliures)

## Estructura del codigo
index.js: Define los comandos del bot + middleware de autenticacion

utils/scenes.js: Define la escena, solo se usa en /placeslliures

Controllers: 
- Api: Define las peticiones a la api del racó
- Auth: Gestiona todo el proceso de autenticación en la api del racó via oauth2
- bd: Gestiona el acceso a la base de datos, utiliza los modelos definidos en models/*
- Notifications: Define el intervalo de polling de avisos del racó y avisa a los usuarios de que tienen nuevos mensajes
 

## Variables de entorno
- BOT_TOKEN: Token que usa para conectarse a la api de telegram
- CLIENT_ID: client id para identificar la app en la api del racó
- CLIENT_SECRET: client secret para identificar la app en la api del racó
- URL: indica el dominio sobre el que esta corriento la app. ej:https://myapp.com
- MONGO_IP: dominio donde se encuentra el servidor mongodb
- MONGO_USER: usuario mongodb
- MONGO_PASS: pass mongodb
- ADMIN_ID: id del admin en telegram (para enviar errores)
- PORT: puerto sobre el que se ejecuta

## Notas
- El entorno de producción actual es heroku. Sobre el dia 24 de cada mes heroku detiene la aplicación porque he agotado las horas de ejecución mensuales gratuitas (por eso al principio de cada mes llegan de golpe mensajes pasados...)
En un futuro me gustaria migrar a otra plataforma para evitarlo (maybe google cloud?) Se aceptan sugerencias :)