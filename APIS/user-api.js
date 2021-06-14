//create mini express app
const exp = require('express')
const userApi = exp.Router();
//import MongoCLient
const mc = require("mongodb").MongoClient;

//connection string
const databaseUrl = "mongodb+srv://vnr2021:vnr2021@cluster0.rjvoz.mongodb.net/vnrdb2021?retryWrites=true&w=majority"

let databaseObj;

//connect to DB
mc.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

    if (err) {
        console.log("err in db connection", err);
    }
    else {
        //get database object
        databaseObj = client.db("vnrdb2021")
        console.log("connected to database")

    }

})




//sample route
userApi.get("/getusers", (req, res) => {
    res.send({ message: "reply from user api" })
})



//export
module.exports = userApi;