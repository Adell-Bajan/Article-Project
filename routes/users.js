// Require Package
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');



// Bring in User Model
let User = require('../models/user');


// Register Form
router.get('/register', function(req, res) {
    res.render('register');
});


// Register Proccess
router.post('/register', function(req, res) {
    const { name, email, username, password, password2 } = req.body;
    let errors = [];

    // Check required fields
    if (!name) {
        errors.push({ msg: 'Name is required' });
    }
    if (!email) {
        errors.push({ msg: 'Email is required' });
    }
    if (!username) {
        errors.push({ msg: 'Username is required' });
    }
    if (!password) {
        errors.push({ msg: 'Password is required' });
    }
    if (!password2) {
        errors.push({ msg: 'Confirm-Password is required' });
    }
    // Check passwords match
    if (password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }
    // Check pass length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            username,
            password,
            password2
        });
    } else {
        let newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password,
        });
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) {
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        req.flash('success', 'You are now registered and can log in');
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
});



// Login router
router.get('/login', function(req, res) {
    res.render('login');
})


// Login Handle
router.post('/login', (req, res, next) => {
    req.flash('success', 'You are now login');
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


// Logout router
router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success', 'You are logged out');
    res.redirect('/users/login');
});


module.exports = router;