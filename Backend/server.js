const bodyParser = require("body-parser");
const express = require("express");
const users = require("./Routes/Api/User");
const passport = require("passport");
const app = express();
require("./Routes/Api/Auth/passport");
const mongoose = require("mongoose");
const producto = require("./Routes/Api/Productos");
const ordenes = require("./Routes/Api/Orden");
const carrito = require("./Routes/Api/Carrito");
const direccion = require("./Routes/Api/Direccion");
const cors = require("cors");
require("dotenv").config();
require("./config/redis");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(
  cookieSession({
    name: "DASA",
    keys: ["this app"],
    maxAge: 24 * 60 * 60 * 100,
    secure: true,
    sameSite: "none",
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    secure: true,
  }),
);

app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).send({
      message:
        "No se encontró un token de autorización. Por favor, inicia sesión.",
    });
  } else {
    next(err);
  }
});

// conexiones
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDb conectado"))
  .catch((err) => console.log(err));

const authCheck = (req, res, next) => {
  if (!req.user) {
    res.status(401).json({
      authenticated: false,
      message: "user has not been authenticated",
    });
  } else {
    next();
  }
};
// routas
app.use("/api/users", users);
app.use("/api/productos", producto);
app.use("/api/ordenes", ordenes);
app.use("/api/direccion", direccion);
app.use("/api/carrito", carrito);
app.get("/api/", authCheck, (req, res) => {
  res.status(200).json({
    authenticated: true,
    message: "user successfully authenticated",
    user: req.user,
    cookies: req.cookies,
  });
});
app.use("/request-type", (req, res, next) => {
  console.log("request type:", req.method);
  next();
});
const port = process.env.PORT || 8080;

app.listen(port, () =>
  console.log("aplicacion esta corriendo en el puerto 3000"),
);
