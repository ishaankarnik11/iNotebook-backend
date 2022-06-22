const express = require("express");
const connectToMongo = require("./database");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

//Available routs
app.use("/api/auth", require('./routes/auth'));
app.use("/api/notes", require('./routes/notes'));

app.listen(port, ()=>{
    console.log(`server started on ${port}`);
});

connectToMongo();

app.get("/",(req,res)=>{
    console.log("get request on / received");
    res.json({"message": "hello world"});
});



