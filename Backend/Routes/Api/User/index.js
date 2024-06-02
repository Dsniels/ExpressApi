const controller = require("./user.controller");
const express = require("express");
const auth = require("../Auth/auth.service");
const passport = require("passport");
const router = express.Router();

router.post("/registrarse", controller.registerUser);

router.post("/login", controller.loginUser);

router.get("/done", controller.done);

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);

router.get("/all", auth.hasRole("manager"), controller.showUsers);

router.get("/:id", auth.hasRole("manager"), controller.show);

router.put("/actualizar/:id", auth.hasRole("user"), controller.updateUser);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    successRedirect: "http://localhost:3000/",
    failureRedirect: "/login",
  }),
  controller.AuthGoogle,
);

module.exports = router;
