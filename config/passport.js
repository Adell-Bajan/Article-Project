const User = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');
var passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');




module.exports = function(passport) {
    // Local Strategy
    passport.use(new LocalStrategy(function(username, password, done) {
        // Match Username
        let query = { username: username };
        User.findOne(query, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'No User Found' });
            }
            // Match password
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Wrong password' });
                }
            })
        });
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}



// passport.use('local.signup', new LocalStrategy({
//     usernameField: 'email',
//     passwordField: 'password',
//     passReqToCallback: true
// }, function(req, email, password, done) {
//     User.findOne({ 'email': email }, function(err, user) {
//         if (err) {
//             return done(err);
//         }
//         if (user) {
//             return done(null, false, { msg: 'Email is already registered' });
//             // errors.push);

//         }
//         var newUser = new User();
//         newUser.email = email;
//         newUser.password = newUser.encryptPassword(password);
//         newUser.save(function(err, result) {
//             if (err) {
//                 return done(err);
//             }
//             return done(null, newUser);
//         });
//     });
// }));