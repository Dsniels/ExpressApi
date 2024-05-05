const bodyParser = require('body-parser');
const express = require('express');
const users = require('./Routes/Api/User');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const producto = require('./Routes/Api/Productos');
const ordenes = require('./Routes/Api/Orden');
const db = require('./config/keys').mongoUrl;
const carrito = require('./Routes/Api/Carrito');
const env = require('dotenv').config();
const redis  = require('redis');


const client = redis.createClient({url : process.env.REDIS_URL});
client.on('error', err => console.log('Error: ', err));
client.connect().then(() => console.log('redis conectado')).catch(err => console.log(err));
//middleware
app.use(bodyParser.urlencoded({
    extended : false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
});
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({message: 'No se encontró un token de autorización. Por favor, inicia sesión.'});
  } else {
    next(err);
  }
});


//conexiones
mongoose.connect(process.env.MONGO_URL).then(()=> console.log('MongoDb conectado')).catch(err => console.log(err));

//routas
app.use("/api/users", users);
app.use("/api/productos", producto);
app.use('/api/ordenes', ordenes);
app.use('/api/carrito', carrito);
app.use('/request-type',(req, res, next) => {
    console.log('request type:', req.method);
    next();
});

app.listen(3000, () => console.log('aplicacion esta corriendo en el puerto 3000'));


