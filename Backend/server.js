const bodyParser = require('body-parser');
const express = require('express');
const users = require('./Routes/Api/User');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const producto = require('./Routes/Api/Productos');

app.use(bodyParser.urlencoded({
    extended : false
}));

app.use(bodyParser.json());

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
});

const db = require('./config/keys').mongoUrl;

mongoose.connect(db)
        .then(()=> console.log('MongoDb conectado'))
        .catch(err => console.log(err));

app.use(passport.initialize());
app.use("/api/users", users);
app.use("/api/productos", producto);
app.use('/request-type',(req, res, next) => {
    console.log('request type:', req.method);
    next();
});


app.get('/', (req, res) => {
    res.send('Hola');
});

app.listen(3000, () => console.log('aplicacion esta corriendo en el puerto 3000'));


