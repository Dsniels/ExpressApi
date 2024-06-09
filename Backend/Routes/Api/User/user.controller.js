const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./user.model");
const keys = require("../../../config/keys");
const paginacion = require("../Specificaciones/Paginacion");
const { signToken } = require("../Auth/auth.service");

exports.registerUser = (request, response) => {
  User.findOne({ email: request.body.email })
    .then((user) => {
      if (user) {
        return response.status(400).json({ email: "El email ya existe" });
      } else {
        const newUser = new User(request.body);
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            console.log(hash);
            newUser.password = hash;
            const payload = { role: newUser.role, id: newUser.id };
            newUser.token = signToken(payload);
            newUser
              .save()
              .then((user) => response.json(user))
              .catch((error) => console.log(error));
          });
        });
      }
    })
    .catch((err) => console.log(err));
};

exports.loginUser = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return response
        .status(404)
        .json({ emailnotfound: "Email no encontrado" });
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        // Crear JWT
        const payload = {
          id: user.id,
          role: user.role,
        };

        const token = signToken(payload);
        user.token = token;
        user.save();

        response.json(user);
      } else {
        return response
          .status(400)
          .json({ passwordincorrect: "Contraseña incorrecta" });
      }
    });
  });

  return null;
};

exports.show = async function (request, response) {
  const user = await User.findById(request.params.id).exec();
  if (!user) {
    return response.send(404);
  }
  return response.json(user);
};

exports.showUsers = async (request, response) => {
  const query = request.query;
  const exclude = ["sort", "page", "limit", "pageSize"];
  const queryObj = { ...query };
  exclude.forEach((element) => {
    delete queryObj[element];
  });
  const users = await paginacion(
    User.find(queryObj).sort(query.sort),
    request.query,
  );

  if (!users) return response.status(404).json({ message: "No hay usuarios" });

  return response.json(users);
};

exports.updateUser = async (request, response) => {
  if (request.user.role === "user") {
    var userid = request.user._id.toHexString();
  } else {
    var userid = request.params.id;
  }

  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(userid, request.body, { returnDocument: "after" })
      .then((docs) => resolve(response.json(docs)))
      .catch((err) => resolve(response.status(403).json(err)));
  });
};

exports.logout = (request, response) => {
  request.logout();
  response.redirect("http://localhost:3000/");
};

exports.perfil = async (request, response) => {
  response.json(request.user);
};

exports.done = async (request, response) => {
  console.log("🚀 ~ exports.done=async ~ request:", request.session);
  if (!request.user) {
    console.log("🚀 ~ exports.done=async ~ user:", request.user);

    response.status(404);
  } else {
    response.json({
      success: true,
      message: "Usuario authenticado con google",
      user: request.user,
      // cookies:request.cookies
    });
  }
};

exports.AuthGoogle = (request, response) => {
  console.log(request);
  response.redirect(
    "https://expressapiecommerce.azurewebsites.net/api/users/done",
  );
};
