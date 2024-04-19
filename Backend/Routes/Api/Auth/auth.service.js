const jwt = require('jsonwebtoken');
const config = require('../../../config/keys');
const {expressjwt : expressJwt} = require('express-jwt');
const compose = require('composable-middleware');
const User = require('../User/user.model');
const validateJwt = expressJwt({ secret : config.secretOrKey, algorithms: ["HS256"] });




function isAuthenticated(){
    return(
        compose()
            .use(function(request, response, next){
                validateJwt(request, response, next);
                if(request.query && request.query.hasOwnProperty("access_token")){
                    request.headers.authorization = "Bearer "+ request.query.access_token;
                }
            })
            .use(async (request, response, next) => {
                const user = await User.findById(request.body._id);
                if(!user) return response.send(401);

                    request.user = user;
                    next();
                
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

