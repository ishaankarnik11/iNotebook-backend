const jwt = require("jsonwebtoken");
const JWT_SECRET = "thisissecretdonotreadthismessage";
const User = require("../models/Users.model");

const fetchusers = (req,res, next)=>{
    const token = req.header('auth-token');
    if(!token)
    {
        res.status(401).json({"error": "Please authenticate using valid token"});
        return;
    }
    else{
            try{
            const userData = jwt.verify(token, JWT_SECRET);
            req.user = userData;
            next();
        }
        catch(err){
            res.status(401).json({"error": "Please authenticate using valid token"});
            return;
        }
    }
};

module.exports = fetchusers;