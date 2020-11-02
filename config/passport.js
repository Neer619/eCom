const passport = require('passport');
const User = require('../models/user');
const localStrategy = require('passport-local').Strategy;
const validator = require('express-validator')

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

passport.use('local.signup',new localStrategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true
},  (req,email,password,done)=>{

    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
    var errors = req.validationErrors();
    // body(email).nonEmpty().isEmail();
    // body(password).nonEmpty().isLength({min:8});
    // var errors = validationResult(req);

    if(errors)
    {
        let messages = [];
        errors.forEach(e=>{
            messages.push(e.msg);
        });

        return done(null,false,req.flash('error',messages));
    }
    

    User.findOne({'email':email},(err,user)=>{
        
        if(err)
        {
            return done(err);
        }
        if(user){
            return done(null,false,{message:'Email is already registered'});
        }

        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);

        newUser.save((err,res)=>{
            if(err){
                return done(err);
            }
            
            return done(null,newUser);
        })

    })
    }
    ));


passport.use('local.signin',new localStrategy({
        usernameField:'email',
        passwordField:'password',
        passReqToCallback:true
    },  (req,email,password,done)=>{
    
        req.checkBody('email','Invalid email').notEmpty();
        req.checkBody('password','Invalid password').notEmpty();
        var errors = req.validationErrors();
        // body(email).nonEmpty().isEmail();
        // body(password).nonEmpty().isLength({min:8});
        // var errors = validationResult(req);
    
        if(errors)
        {
            let messages = [];
            errors.forEach(e=>{
                messages.push(e.msg);
            });
    
            return done(null,false,req.flash('error',messages));
        }
        
    
        User.findOne({'email':email},(err,user)=>{
            
            if(err)
            {
                return done(err);
            }
            if(!user){
                return done(null,false,{message:'No such user found!'});
            }

            if(!user.validPassword(password)){
                return done(null,false,{message:'Wrong Password'});
            }
    
            return done(null,user);
    
        })

        }
        ));