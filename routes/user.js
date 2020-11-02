var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const passport = require('passport');

const csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile',isLoggedin,(req,res,next)=>{
    res.render('user/profile',{title:"Profile"});
});

router.get('/logout',isLoggedin,(req,res,next)=>{
    req.logout();
    res.redirect('/');
});



router.use('/',notLoggedin,(req,res,next)=>{
    next();
});

router.get('/signup',(req,res,next)=>{
    let messages = req.flash('error');
    res.render('user/signup',{title:'Signup' , csrfToken:req.csrfToken(),messages,hasErrors:messages.length>0});
  
});
  
router.post('/signup',passport.authenticate('local.signup',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/signup',
    failureFlash:true
}));

router.get('/signin',(req,res,next)=>{
    let messages = req.flash('error');
    res.render('user/signin',{title:'Signin' , csrfToken:req.csrfToken(),messages,hasErrors:messages.length>0});
  
});
  
router.post('/signin',passport.authenticate('local.signin',{
    successRedirect:'/user/profile',
    failureRedirect:'/user/signin',
    failureFlash:true
}));
  
  

  
  
  module.exports = router;

  function isLoggedin(req,res,next){
      if(req.isAuthenticated())
      {
          return next();
      }
      
      res.redirect('/');
  }
  

  function notLoggedin(req,res,next){
    if(!req.isAuthenticated())
    {
        return next();
    }
    
    res.redirect('/');
  }