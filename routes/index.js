var express = require('express');
var router = express.Router();

const userModel=require("./users");
const passport = require('passport');
const localStrategy=require("passport-local")

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/profile',isLoggedin , function(req, res, next) {
  res.render('profile');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.post('/register', function(req, res, next) {
 let data=new userModel({
  username:req.body.username,
  name:req.body.name,
  email:req.body.email
 });

 userModel.register(data,req.body.password)
 .then(()=>{
  passport.authenticate("local"),(req,res,function(){
    res.redirect("/profile");
  })
 })
});

router.post('/login', passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/"
}),function(req, res, next) {
});

router.get("/logout", isLoggedin,(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/login');
  });
})

function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect("/login");
}

module.exports = router;
