//create mini express app
const exp = require('express')
const userApi = exp.Router();
const expressErrorHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
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
//get users
userApi.get("/getusers", expressErrorHandler(async (req, res) => {

    let userList = await userCollectionObj.find().toArray()
    res.send({ message: userList })

}))





//get user by username
userApi.get("/getuser/:username", expressErrorHandler(async (req, res, next) => {

    //get username from url
    let un = req.params.username;
    //search
    let userObj = await userCollectionObj.findOne({ username: un })

    if (userObj === null) {
        res.send({ message: "User not existed" })
    }
    else {
        res.send({ message: userObj })
    }
}))



















//http://localhost:3000/user/createuser
//create user
userApi.post("/createuser", expressErrorHandler(async (req, res, next) => {
    //get user obj
    let newUser = req.body;
    //search for existing user
    let user = await userCollectionObj.findOne({ username: newUser.username })
    //if user existed
    if (user !== null) {
        res.send({ message: "User already existed" })
    }
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUser.password, 7)
        //replace password
        newUser.password = hashedPassword;
        //insert
        await userCollectionObj.insertOne(newUser)
        res.send({ message: "User created" })
    }
}))




//http://localhost:3000/user/updateuser/<username>

userApi.put("/updateuser/:username", expressErrorHandler(async (req, res, next) => {

    //get modified user
    let modifiedUser = req.body;
    //update
    await userCollectionObj.updateOne({ username: modifiedUser.username }, { $set: { ...modifiedUser } })
    //send res
    res.send({ message: "User modified" })

}))




//delete user
userApi.delete("/deleteuser/:username", expressErrorHandler(async (req, res) => {

    //get username from url
    let un = req.params.username;
    //find the user
    let user = await userCollectionObj.findOne({ username: un })

    if (user === null) {
        res.send({ message: "User not existed" })
    }
    else {
        await userCollectionObj.deleteOne({ username: un })
        res.send({ message: "user removed" })
    }
}))




//user login
userApi.post('/login', expressErrorHandler(async (req, res) => {

    //get user credetials
    let credentials = req.body;
    //search user by username
    let user = await userCollectionObj.findOne({ username: credentials.username })
    //if user not found
    if (user === null) {
        res.send({ message: "invalid username" })
    }
    else {
        //compare the password
        let result = await bcryptjs.compare(credentials.password, user.password)
        //if not matched
        if (result === false) {
            res.send({ message: "Invalid password" })
        }
        else {
            //create a token
            let signedToken =  jwt.sign({ username: credentials.username }, 'abcdef', { expiresIn: 120 })
            //send token to client
            res.send({ message: "login success", token: signedToken,username: credentials.username })
        }

    }

}))




//export
module.exports = userApi;