const express = require('express');
const router = express.Router();

// Article model
const Article = require('../models/article');
// Article Model
const User = require('../models/user');




// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('add_article', {
        title: ' Add Article'
    });
});


// Add Submit Post Route
router.post('/add', (req, res) => {
    const { title, author, body } = req.body;
    let errors = [];


    // Check required fields
    if (!title) {
        errors.push({ msg: 'Title is required' });
    }
    // if (!author) {
    //     errors.push({ msg: 'Author is required' });
    // }
    if (!body) {
        errors.push({ msg: 'Body is required' });
    }
    if (errors.length > 0) {
        res.render('add_article', {
            title: ' Add Article',
            errors,

        });
    } else {

        let article = new Article();
        article.title = req.body.title;
        article.author = req.user._id;
        article.body = req.body.body;

        article.save(function(err) {
            if (err) {
                console.log(err)
            } else {
                req.flash('messages', 'Article Added');
                res.redirect('/');
            }
        })
    }
})


// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        if (article.author != req.user._id) {
            req.flash('danger', 'Not Authorized');
            res.redirect('/');
        }
        res.render('edit_article', {
            title: 'Edit Article',
            article: article
        });
    });
});



// Update Submit Post Route
router.post('/edit/:id', (req, res) => {
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    let query = { _id: req.params.id }

    Article.update(query, article, function(err) {
        if (err) {
            console.log(err)
        } else {
            req.flash('messages', 'Article Updated');
            res.redirect('/');
        }
    })
})




// Delete Article
router.delete('/:id', function(req, res) {
    if (!req.user._id) {
        res.status(500).send();
    }


    let query = { _id: req.params.id }

    Article.findById(req.params.id, function(err, article) {
        if (article.author != req.user._id) {
            res.status(500).send();
        } else {
            Article.remove(query, function(err) {
                if (err) {
                    console.log(err)
                }
                res.send('Success');
            });
        }
    })
});



// Get single Article
router.get('/:id', function(req, res) {
    Article.findById(req.params.id, function(err, article) {
        User.findById(article.author, function(err, user) {
            res.render('article', {
                article: article,
                author: user.name
            });
        });
    });
});




// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Please login');
        res.redirect('/users/login');
    }
}





module.exports = router;