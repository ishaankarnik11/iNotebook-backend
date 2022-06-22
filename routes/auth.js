const Router = require("express").Router();
const User = require("../models/Users.model");
const { body, validationResult } = require("express-validator");
const { Error } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchusers = require("../middleware/fetchuser");

const saltRounds = 10;
const JWT_SECRET = "thisissecretdonotreadthismessage";



//User will not get created, this method is only for testing connectivity.
Router.route("/").get((req, res) => {
    console.log(req.body.name)
    res.json({ "message": "hello from auth file" });
});


//Route 1 : Login is not required
//User authentication will be done in post request. 
//using express-validator as a middleware for validating request parameters. 
//Using a custome validation for email already exsists with help of express validator. 
Router.route("/createuser").post(
    [body('name', 'Please enter valid name, minimum 3 characters').isLength({ min: 3 }),
    body('email', 'Please enter valid email ID').isEmail(),
    body('password', 'Please enter valid password, minimum 5 characters').isLength({ min: 5 }),
    body('email').custom(value => {
        return User.find({ "email": value }).then(data => {
            console.log(data);
            if (data.length > 0) {
                return Promise.reject('Email already exsists');
            }
        })
    })
    ],
    async (req, res) => {
        try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ "errors": errors.array() })
        }
        else {
            bcrypt.hash(req.body.password, saltRounds, async (err, hash)=>{
                if(!err){
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                    });
                    newUser.save()
                        .then(async (user) => {
                            let authtoken = jwt.sign({id:user._id}, JWT_SECRET);
                            res.json({authtoken});
                    
                    })
                        .catch(err => res.status(400).json(err));
                }
                else{
                    res.status(500).json({"error": err});
                }
            });
            }

        console.log(req.body)
    }
    catch(err){
        res.status(500).json({"error": err});

    }

    });



//Route 2 : Login is required
//User login check will be performed in this method. 
Router.route("/login").post([body('email','Email Can not be Blank').exists(),
                             body('password','Password Can not be Blank').exists(),
                            body('email','Please enter valid email ID').isEmail()],
    (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({ "errors": errors.array() });
        }
        else{
            const {email, password} = req.body;
            try{
                User.findOne({email})
                .then(user=>{
                    if(!user)
                    {
                        res.status(400).json({ "error": "Please login with correct credentials" });
                    }
                    else{
                        bcrypt.compare(password, user.password)
                        .then(isPasswordCorrect=>{
                            if(isPasswordCorrect){
                                let authtoken = jwt.sign({id:user._id}, JWT_SECRET);
                                res.json({authtoken});
                            }
                            else{
                                res.status(400).json({ "error": "Please login with correct credentials" });
                            }
                        })
                        .catch(err=>res.status(400).json({ "errors": err }))
                        
                    }
                })
                .catch(err=>res.status(400).json({ "errors": err }))
            }
            catch(err){

            }
        }

});


//Route 3 : Fetch logged in users details : Login will be required for this route
Router.route("/getuser").post(fetchusers,(req,res)=>{
    try{
        // const {authtoken} = req.body;
        User.findById(req.user.id).select("email name")
        .then(data=>{res.json({ "message": data });})
        .catch(err=>{res.status(400).json({ "errors": err })});
        
        
    }
    catch(err){

    }
});

module.exports = Router;