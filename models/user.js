var mongoose=require("mongoose");
var passportlocalmongoose=require("passport-local-mongoose");
var UserSchema=new mongoose.Schema({
   
    username :String,
    firstname : String,
    lasttname : String,
     password: String,
     phone:Number,
     Birthday:Date,
     gender:String,
});

UserSchema.plugin(passportlocalmongoose);
module.exports=mongoose.model("User",UserSchema);