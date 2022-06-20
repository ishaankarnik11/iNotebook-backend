const express = require("express");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.listen(port, ()=>{
    console.log(`server started on ${port}`);
});


app.get("/",(req,res)=>{
    console.log("get request on / received");
    res.json({"message": "hello world"});
});
