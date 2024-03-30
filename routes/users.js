const mongoose=require("mongoose");
const passport = require("passport");
const plm=require("passport-local-mongoose");


mongoose.connect("mongodb://127.0.0.1:27017/pinterest");


const userModel=mongoose.Schema({
  username:String,
  name:String,
  email:String,
  password:String,
  profileImage:String,
  boards:[],
  posts:[
    type=mongoose.Schema.Types.ObjectId,
    ref="post"
  ] 
})

userModel.plugin(plm);

module.exports=mongoose.model("user",userModel);