const controller = require('./user.controller')
const express = require('express')
const auth = require('../Auth/auth.service');
const passport = require('passport');
const router = express.Router();



router.post('/registrarse', controller.registerUser);

router.post('/login', controller.loginUser);

router.get('/login/done' ,controller.done);

router.get('/logout', controller.logout)

router.get('/google', passport.authenticate('google',{scope : ['profile', 'email']} ));

router.get('/perfil', auth.hasRole('user'), controller.perfil)

router.get('/perfil/all', auth.hasRole('manager'), controller.showUsers);

router.get('perfil/:id', auth.hasRole('manager'), controller.show);

router.put('/actualizar/:id', auth.hasRole('user'), controller.updateUser);

router.get('/google/callback',passport.authenticate('google',{successRedirect: 'http://localhost:3000/',failureRedirect : '/login'}));


module.exports = router
