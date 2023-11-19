var express                 = require("express");
var mongoose                =require("mongoose");
var methodoverride          = require("method-override");
var passport                =require("passport");
var bodyparser              =require("body-parser");
var localstrategy           =require("passport-local");
var passportlocalmongoose   =require("passport-local-mongoose");
var User                    =require("./models/user");

mongoose.connect("mongodb://localhost/MSWEB",{useNewUrlParser:true,useUnifiedTopology: true});
var app=express();
app.use(express.static("sheets"));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyparser.urlencoded({extended: true}));
app.use(methodoverride("_method"));

app.use(require("express-session")({
    secret:"MS IS ONE TO MAKE HISTORY",
    resave:false,
    saveUninitialized:false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/about",function(req, res) {
   res.render("about"); 
});

////ROUTES

app.get("/",function(req,res){
    res.render("home");
});
app.get("/homepage",isLoggedIn,function(req,res){
   res.render("homepage"); 
});

//AUTH ROUTES
app.get("/signup",function(req, res) {
   res.render("signup"); 
});
app.post("/signup",function(req,res){
   
     req.body.username
    req.body.password
     User.register(new User({username:req.body.username, firstname : req.body.firstname ,lasttname : req.body.lasttname,phone:req.body.phone,Birthday:req.body.Birthday,gender:req.body.gender}),req.body.password,function(err,User){
         if(err){
             console.log("err");
             return res.render('signup');
         }
         passport.authenticate("local")(req,res,function(){
           res.render("homepage"); 
         });
        
        
     });
});

//LOGIN ROUTES
app.get("/login",function(req, res) {
   res.render("login"); 
});
app.post("/login",passport.authenticate("local",{
    
    successRedirect:"/homepage",
    failureRedirect:"/login",
}),function(req,res){
    
});



//logout route
app.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/login');
      }
    });
  }
});

var blogSchema = new mongoose.Schema({
    Title: String,
    image: String,
    body : String,
    created :{type: Date, default:Date.now}
});
var blog = mongoose.model("blog", blogSchema)

//Restful Routes
app.get("/",isLoggedIn,function(req,res){
   res.redirect("/blogs"); 
});
//Index Route
app.get("/blogs",isLoggedIn,function(req,res){
   blog.find({}, function(err, blogs){
       if(err){
           console.log("Error");
       }else{
           res.render("post",{blogs:blogs});
       }
   }) ;
});

//New Route
app.get("/blogs/new",isLoggedIn,function(req, res) {
  res.render("new"); 
});
//Create Route
app.post("/blogs",isLoggedIn,function(req,res){
   blog.create(req.body.blog,function(err, newblog){
       if(err){
           res.render("new");
       }else{
           res.redirect("/blogs");
       }
   }) ;
});
//SHOW ROUTE
app.get("/blogs/:id",isLoggedIn, function(req,res){
    blog.findById(req.params.id,function(err, foundblog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundblog});
        }
    });
});
//Edit Route
app.get("/blogs/:id/edit",isLoggedIn,function(req, res) {
   blog.findById(req.params.id,function(err, foundblog){
       if(err){
           res.redirect("/blogs");
       }else{
           res.render("edit",{blog :foundblog})
       }
   }) ;
});
//Update Route
app.put("/blogs/:id",isLoggedIn,function(req,res){
   blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err ,updateblog){
      if(err){
          res.redirect("/blogs");
          
      } else{
          res.redirect("/blogs/" + req.params.id);
      }
   });
});
//Delete Route
app.delete("/blogs/:id", isLoggedIn,function(req,res){
   blog.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/blogs");
      } else{
          res.redirect("/blogs");
      }
   });
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}



app.listen(process.env.PORT,process.env.IP,function(){
   console.log("UR SERVER IS READY BABE!!!"); 
});


 