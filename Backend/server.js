const bodyParser = require('body-parser');
const express = require('express');

const app = express();

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

app.use('/request-type',(req, res, next) => {
    console.log('request type:', req.method);
    next();
});

app.get('/', (req, res) => {
    res.send('Hola');
});

app.listen(3000, () => console.log('aplicacion esta corriendo en el puerto 3000'));


