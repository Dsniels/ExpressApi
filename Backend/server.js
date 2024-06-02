const bodyParser = require('body-parser');
const express = require('express');
const users = require('./Routes/Api/User');
const passport = require('passport');
const app = express();
require('./Routes/Api/Auth/passport');
const mongoose = require('mongoose');
const producto = require('./Routes/Api/Productos');
const ordenes = require('./Routes/Api/Orden');
const carrito = require('./Routes/Api/Carrito');
const direccion = require('./Routes/Api/Direccion');
const cors = require('cors');
require('dotenv').config();
require('./config/redis');
const session = require('express-session');


// middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use(session({
  secret : 'DASA',
  resave : false,
  saveUninitialized: true,
}));

app.use(cors({
  origin: 'http://localhost:3000', // Permitir este origen
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  credentials: true // Permitir cookies de terceros
}))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET')
    return res.status(200).json({})
  }
  next()
})
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send({
      message:
        'No se encontró un token de autorización. Por favor, inicia sesión.'
    })
  } else {
    next(err)
  }
})

// conexiones
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDb conectado'))
  .catch((err) => console.log(err))

// routas
app.use('/api/users', users)
app.use('/api/productos', producto)
app.use('/api/ordenes', ordenes)
app.use('/api/direccion', direccion)
app.use('/api/carrito', carrito)
app.use('/request-type', (req, res, next) => {
  console.log('request type:', req.method)
  next()
})
const port = process.env.PORT || 8080 

app.listen(port, () =>
  console.log('aplicacion esta corriendo en el puerto 3000')
)
