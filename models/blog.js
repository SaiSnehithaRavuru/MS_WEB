var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var blogSchema=new mongoose.Schema({
   
  Title:String,
    image:String,
    body:String,
    created:{type:Date, default: Date.now}
});

blogSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("blog",blogSchema);
