const mongoose=require("mongoose");
const connect=mongoose.connect("mongodb://localhost:27017/DEMODB");

//whether database connected
connect.then(() =>{
    console.log("Database connection successful");
})
.catch(() =>{
    console.log("Database connection failed!Try Again");

});

//schema

const LoginSchema = new mongoose.Schema({
name:{
    type:String,
    required: true
},
password:{
    type:String,
    required: true
}

});
//collection

const collection =new mongoose.model("students",LoginSchema);
module.exports=collection ;

