//create mini express app
const exp = require('express')
const userApi = exp.Router();
//add body parsing middleware
userApi.use(exp.json())


//import MongoCLient
const mc = require("mongodb").MongoClient;



//connection string
const databaseUrl = "mongodb+srv://vnr2021:vnr2021@cluster0.rjvoz.mongodb.net/vnrdb2021?retryWrites=true&w=majority"

//const databaseUrl="mongodb://<username>:<password>@cluster0-shard-00-00.rjvoz.mongodb.net:27017,cluster0-shard-00-01.rjvoz.mongodb.net:27017,cluster0-shard-00-02.rjvoz.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"

let userCollectionObj;

//connect to DB
mc.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {

    if (err) {
        console.log("err in db connection", err);
    }
    else {
        //get database object
        let databaseObj = client.db("vnrdb2021")
        //create usercollection object
        userCollectionObj = databaseObj.collection("usercollection")
        console.log("connected to database")

    }
})




//http://localhost:3000/user/getusers
userApi.get("/getusers", (req, res, next) => {

    //read docs from user collection
    userCollectionObj.find().toArray((err, usersList) => {

        //deal with error
        if (err) {
            console.log("err in reading users data", err)
            res.send({ message: err.message })
        }
        else {
            res.send({ message: usersList })
        }
    })
})


//http://localhost:3000/user/getuser/<username>
userApi.get("/getuser/:username", (req, res, next) => {

    //get username from url params
    let un = req.params.username;

    //search for user
    userCollectionObj.findOne({ username: un }, (err, userObj) => {
        if (err) {
            console.log("err in reading users data", err)
            res.send({ message: err.message })
        }

        //if user not existed
        if (userObj === null) {
            res.send({ message: "User not found" })
        }
        //if user existed
        else {
            res.send({ message: userObj })
        }


    })
})









//http://localhost:3000/user/createuser
userApi.post("/createuser", (req, res, next) => {

    //get user obj
    let newUser = req.body;

    //check user in db with  this username
    userCollectionObj.findOne({ username: newUser.username }, (err, userObj) => {

        if (err) {
            console.log("err in reading users data", err)
            res.send({ message: err.message })
        }

        //if user not existed
        if (userObj === null) {
            //create new user
            userCollectionObj.insertOne(newUser, (err, success) => {
                if (err) {
                    console.log("err in reading users data", err)
                    res.send({ message: err.message })
                }
                else {
                    res.send({ message: "New user created" })
                }
            })
        }
        else {
            res.send({ message: "User already existed" })
        }

    })
})







//http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username", (req, res, next) => {

    //get modified user
    let modifiedUser = req.body;

    //update
    userCollectionObj.updateOne({ username: modifiedUser.username }, {
        $set: { ...modifiedUser }
    }, (err, success) => {

        if (err) {
            console.log("err in reading users data", err)
            res.send({ message: err.message })
        }
        else {
            res.send({ message: "User updated" })
        }
    })

})
















//export
module.exports = userApi;