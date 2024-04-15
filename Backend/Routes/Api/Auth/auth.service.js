const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const compose = require('composable-middleware');
const User = require('../User/user.model');
const validateJwt = expressJwt({ secret : config.secretOrKey });

function isAuthenticated(){
    return(
        compose()
            .use(function(request, response, next){
                validateJwt(request, response, next);
                if(request.query && request.query.hasOwnProterty("access_token")){
                    request.headers.authorization = "Bearer "+ request.query.access_token;
                }
            })
            .use((request, response, next) => {
                User.findById(request.user.id, (err, user) =>{
                    if(err) return next(err);
                    if(!err) return response.send(401);

                    request.user = user;
                    next();
                });
            })
    );
}


function hasRole(roleRequired){
    if(!roleRequired) throw new Error("Requiere un role");

    return compose()
            .use(isAuthenticated())
            .use(function meetsRequirements(request, response, next) {
                if(
                    config.userRoles.indexOf(request.user.role) >= 
                    config.userRoles.indexOf(roleRequired)
                ){
                    next();   
                } else {
                    response.send(403);
                }
            });
}


function signToken(id){
    return jwt.sign({_id : id}, config.secretOrKey);
}


function setTokenCookie(request, response){
    if(!request.user){
        return response.json(404, {message : "Algo salio mal, intente de nuevo"});
    }
    const token = signToken(request.user._id);
    response.cookie("token", JSON.stringify(token));
    response.redirect("/");
}


exports.isAuthenticated = isAuthenticated;
exports.hasRole = hasRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;

