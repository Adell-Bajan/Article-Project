const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./config/database');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');


// Init App
const app = express();


// Bring model
const Article = require('./models/article')


// Connect to MongoDB
mongoose.connect(config.database, { useNewUrlParser: true });
mongoose.connection.once('open', function() {
    console.log('Conection has been mongodb!');
}).on('error', function(error) {
    console.log('Error is: ', error);
});



// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));


// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Connect flash
app.use(flash());


// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});


// Global Vars 
// app.use((req, res, next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
//     res.locals.error = req.flash('error');
//     next();
// });


// Passport Config
require('./config/passport')(passport);





// Passport middlwere
app.use(passport.initialize());
app.use(passport.session());


// Route **
app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
});



// Hoem Route
app.get('/', (req, res) => {
    Article.find({}, function(err, articles) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {
                title: 'Articles',
                articles: articles
            });
        }
    })

});


// Routes Files
let articles = require('./routes/articles');
let users = require('./routes/users');

app.use('/articles', articles);
app.use('/users', users);






app.listen(3080);
console.log('Server is runing on port 3000');