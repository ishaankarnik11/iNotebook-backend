require("dotenv").config();
const mongoose = require("mongoose");

db_url = process.env.DB_CONNECTION;

const connectToMongoose = ()=>{
    mongoose.connect(db_url, ()=>{
        console.log("DB Connection established.");
    })
};

module.exports = connectToMongoose;

