const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//User Model
const User=require('../models/Users');

module.exports = function (passport){
    passport.use(
        new LocalStrategy({ usernameField : 'email'},(email,password,done)=>{
            //Match User
            User.findOne({email:email})
            .then(user =>{
             if(!user) {
                 return done(null,false,{message:'Email is Not Registered!'});
             }   

             //Match Password
             bcrypt.compare(password,user.password, (err,isMatch)=>{
                if(err) throw err;

                if(isMatch){
                    return done(null,user);
                }
                else{
                    return done(null,false,{message :'Password is Incorrect!'});
                }
             })
             
            })
            .catch(err=> console.log(err));
        })
    );
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id); 
        // where is this user.id going? Are we supposed to access this anywhere?
    });
    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
    });
});

}