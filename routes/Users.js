const express = require('express');
const users = express.Router();
const cors = require('cors')
const jwt =  require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';
const today = new Date();

users.post('/register', (req, res) => {
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        create: today
    }

    // User.findOne({email: req.body.email}, (err, result) => {
    //     if (condition) {
            
    //     } else {
            
    //     }
    // })

// Registering after checking previous  emails ids
User.findOne({email: req.body.email})
    .then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) =>  {
                userData.password = hash;
                User.create(userData)
                    .then(user => {
                        res.json({status: user.email + ' Registered'})
                    })
                    .catch((err) => {
                        res.send('error: ' + err);
                    })
            });
        } else {
            res.json({error: 'User Already exists'})
        }
    })
    .catch((err) => {
        res.json('error: ' + err);
    })
});

// Login
users.post('/login', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    // if password matches
                    const payload = {
                        _id: user.id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email
                    }
                    let token = jwt.sign(payload, process.env.SECRET_KEY, {
                        expiresIn: 1440
                    })
                    res.json({token});
                } else {
                    res.json({error: 'User does not exist'});
                }
            } else {
                res.json({error: 'User does not exist'});
            }
        })
        .catch((err) => {
            res.send('error: ' + err);
        })
});

// Fetching the profile
users.get('/profile', (req, res) =>  {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    User.findOne({ _id:decoded._id })
        .then(user => {
            if (user) {
                res.json(user);
            } else {
                res.send('User does not exist')
            }
        })
        .catch((err) => {
            res.send('error: ' + err);
        })
});


module.exports = users;