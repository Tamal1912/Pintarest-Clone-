var express = require('express');
var router = express.Router();

const userModel=require("./users");
const postModel=require("./post");
const passport = require('passport');
const localStrategy=require("passport-local")
const upload=require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

router.get('/profile',isLoggedin ,async function(req, res, next) {
  const user= 
  await userModel
        .findOne({username:req.session.passport.user})
        .populate("posts");
        console.log(user);
  res.render('profile',{user,nav:true});
});

router.get('/show/posts',isLoggedin ,async function(req, res, next) {
  const user= 
  await userModel
        .findOne({username:req.session.passport.user})
        .populate("posts");
        console.log(user);
  res.render('show',{user,nav:true});
});
 
router.get("/feed",async (req,res)=>{
  const user= await userModel.findOne({username:req.session.passport.user})
  const posts =await postModel.find()
           .populate("user");
  
  res.render("feed",{user,posts,nav:true});
})

router.get('/add',isLoggedin ,async function(req, res, next) {
  const user= await userModel.findOne({
    username:req.session.passport.user
  })
  res.render('add',{user,nav:true});
});

router.post('/createpost',isLoggedin ,upload.single("post-image"),async function(req, res, next) {
  const user= await userModel.findOne({
    username:req.session.passport.user
  })

  const post=await postModel.create({
    user:user._id,
    title:req.body.title,
    desc:req.body.desc,
    image:req.file.filename
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});

router.post("/uploadProfileImage", isLoggedin,upload.single("profileImage"),async (req,res)=>{
 const user =await userModel.findOne({
  username:req.session.passport.user
 });

 user. profileImage=req.file.filename;
 await user.save();

 res.redirect("/profile");
})

router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

router.post('/register', function(req, res, next) {
 let data=new userModel({
  username:req.body.username,
  name:req.body.name,
  email:req.body.email
 });

 userModel.register(data,req.body.password)
 .then(()=>{
  passport.authenticate("local")(req,res,function(){
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
    res.redirect('/');
  });
})

function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }

  res.redirect("/");
}

module.exports = router;
