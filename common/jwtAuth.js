const config = require('./../config.json');
const jwt = require('jsonwebtoken');

function ensureToken(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, config.JWT_SECRET_KEY,function(err, decoded){
            if(err){
                return res.send({status : 0, message : 'Failed to authenticate token.'}); 
            } else {
                req.body.id = decoded.id;
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = {ensureToken};
