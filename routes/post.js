const mongoose=require("mongoose");

const postModel=mongoose.Schema({
 user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
 },
 title:String,
 desc:String,
 image:String,
 posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"post"
    }
 ]
})


module.exports=mongoose.model("post",postModel);