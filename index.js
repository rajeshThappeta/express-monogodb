//create express app
const exp = require("express")
const app = exp();

//import APIS
const userApi = require("./APIS/user-api")
const productApi = require("./APIS/product-api")


//execute specific api based on path
app.use("/user", userApi)
app.use("/product", productApi)

//invalid path
app.use((req, res, next) => {

    res.send({ message: `path ${req.url} is invalid` })
})

//error handling middleware
app.use((err, req, res, next) => {
    res.send({ message: `error is ${err.message}` })
})


//assign port
const port = 3000;
app.listen(port, () => console.log(`server on ${port}...`))