const jwt = require("jsonwebtoken");
const config = require("../authConfig")
const db = require("../models/login")
const User = db.user;

const verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token){
        return res.status(403).send({ message: "No token provided!"})
    }
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message :"Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};
const isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: {$in: user.roles}
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err});
                    return;
                }
                for (let i = 0; i < roles.length; i++){
                    if (roles[i].name === "admin"){
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Admin Role !"});
            }
        );
    });
};



const authentication = {
    verifyToken,
    isAdmin
};
module.exports = authentication;