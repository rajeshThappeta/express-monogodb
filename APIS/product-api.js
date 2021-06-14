//create mini express app
const exp=require('express')
const productApi=exp.Router();




//sample route
productApi.get("/getproducts",(req,res)=>{
    res.send({message:"reply from product api"})
})



//export
module.exports=productApi;