const mongoose = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const Item = require('../models/item');
const randomLinks = require('../config/randomImageLinks');
const dateGenerator = require('../config/generateDate');

module.exports = {
    register: function (name, email, hashedPassword, done) {
        User.find({ email: email }, (err, data) => {
            if (err) console.error(err);
            if (data.length) {
                done(null, {
                    msg: "User exsit"
                })
            }
            else {
                let secretKey = Date();
                let token = jwt.sign({
                    name: name,
                    email: email
                }, secretKey, {
                    algorithm: "HS256",
                    expiresIn: "2h"
                });
                let newUser = new User({
                    name: name,
                    email: email,
                    hashedPassword: hashedPassword,
                    secretKey: secretKey,
                    token: token
                })
                newUser.save(err => {
                    if (err) console.error(err);
                    done(null, {
                        token: token,
                        _id: newUser._id
                    });
                });
            }
        })
    },
    login: function (email, done) {
        User.findOne({
            email: email
        }, (err, data) => {
            if (err) console.error(err);
            if (!!data) {
                done(null, {
                    user: data
                })
            }
            else done(null, {
                msg: "Login failed"
            })
        })
    },
    // create data only when starting project
    addRandomItem: (done) => {
        User.find({}, (err, data) => {
            if (err) console.error(err);
            let randomItems = [];
            for (let i = 0; i < 30; i++) {
                let newItem = new Item({
                    userSellID: data[Math.ceil(Math.random())]._id,
                    name: "Something",
                    detail: "",
                    category: Math.ceil(Math.random() * 70),
                    images: randomLinks[Math.ceil(Math.random() * (randomLinks.length - 1))],
                    currentPrice: Math.ceil(Math.random() * 100),
                    beginDate: dateGenerator.generateDate(),
                    endDate: dateGenerator.generateDate()
                })
                newItem.save(err => {
                    if (err) console.error(err);
                })
                randomItems.push(newItem);
            }
            done(null, {
                items: randomItems
            })
        })
    },
    //  get all userID for generating current winners for items
    getAllUserIDs: (done) => {
        User.find({},(err,data) => {
            if(err) console.error(err);
            let userIDs = data.map(user => user._id);
            done(null,userIDs);
        })
    },
    refreshToken: (email, newToken, done) => {
        User.findOneAndUpdate({ email: email },{token: newToken},{useFindAndModify: true},(err,data) => {
            if(err) console.error(err);
            done(null,data);
        })
    },
    getCurrentWinner: (id,done) => {
        User.findOne({_id: id},(err,data) => {
            if(err) console.error(err);
            done(null,data);
        })
    },
    getUserForAuthen: (userID,done) => {
        User.findOne({_id: userID},(err,data) => {
            if(err) console.error(err);
            done(null,data);
        })
    }
}