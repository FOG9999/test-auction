const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;
const mongoose = require('mongoose');
const config = require('./config/database');
const userctl = require('./controllers/userctl');
const bcrypt = require('bcryptjs');
const itemctl = require('./controllers/itemctl');
const jwt = require('jsonwebtoken');
const buyerctl = require('./controllers/buyerctl');
const orderctl = require('./controllers/orderctl');
const item = require('./models/item');
// const uploadDrive = require('./uploadDrive'); => only use when upload from local machine
//const upload = require('express-fileupload');
const path = require('path');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use(upload());

mongoose.connect(config.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log('Database connected');
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    app.get('*',(req,res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
})

app.post('/user/login', async (req, res, next) => {
    let { email, password } = req.body;
    userctl.login(email, (err, data) => {
        if (err) next();
        //console.log(data);
        if (data.msg) {
            res.send(data.msg);
        }
        else {
            bcrypt.compare(password, data.user.hashedPassword, (err, same) => {
                if (err) next();
                if (same) {
                    let newToken = jwt.sign({
                        name: data.user.name,
                        email: data.user.email,
                        userID: data.user._id
                    }, data.user.secretKey, {
                        algorithm: "HS256",
                        expiresIn: "2h"
                    });
                    userctl.refreshToken(data.user.email, newToken, (err, newData) => {
                        if (err) {
                            next(err);
                            res.status(500).json({
                                msg: "Server error"
                            })
                        }
                        console.log('user '+data.user.email+' logged in with new token.');
                        res.send({
                            msg: "Login successfully",
                            newToken: newToken,
                            userID: newData._id
                        })
                    })
                }
                else res.send({
                    msg: "Login failed"
                })
            })
        }
    })
})

app.post('/user/register', async (req, res, next) => {
    let { name, email, password } = req.body;
    let hashed = await bcrypt.hash(password, 10);
    userctl.register(name, email, hashed, (err, data) => {
        if (err) next();
        if (data.msg) {
            res.send({
                msg: data.msg
            })
        }
        else
            res.send({
                msg: "Successfully",
                token: data.token,
                userID: data._id
            })
    });
})

app.post('/generateRandomItem', (req, res, next) => {
    userctl.addRandomItem((err, data) => {
        if (err) next(err);
        res.send(data);
    })
})

// get all items for listing
app.post('/getAllItems', (req, res, next) => {
    itemctl.getAllItems(req.body.page,(err, data) => {
        if (err) next(err);
        res.send(data);
    })
})

// get a specific item
app.get('/item', (req, res, next) => {
    itemctl.getOneItem(req.query.id, (err, data) => {
        if (err) next(err);
        res.send(data);
    })
})

// get current winner for an item
app.get('/getCurrentWinner', (req, res, next) => {
    userctl.getCurrentWinner(req.query.id, (err, data) => {
        if (err) next(err);
        if (data) {
            res.send({
                msg: "No auction"
            })
        }
        else {
            res.send(data);
        }
    })
})

// generate random current winners
app.post('/generateCurrWinners', (req, res, next) => {
    userctl.getAllUserIDs((err1, userIDs) => {
        if (err1) next(err1);
        itemctl.getAllItemIDs((err2, itemIDs) => {
            if (err2) next(err2);
            for (let i = 0; i < 3; i++) {
                buyerctl.createBuyer(
                    userIDs[Math.floor(Math.random() * userIDs.length)],
                    Math.round(Math.random() * 100),
                    itemIDs[Math.floor(Math.random() * itemIDs.length)],
                    (err3, data) => {
                        if (err3) next(err3);
                    }
                )
            }
            buyerctl.getBuyersAndSellers((err, data) => {
                if (err) next(err);
                res.send({
                    msg: 'created'
                });
            })
        })
    })
})

// update all items with new property 'isSold'
app.post('/updateIsSold',(req,res,next) => {
    item.updateMany({},{isSold: false},(err,data) => {
        if(err) next(err);
        res.send({
            updatedDocs: data.length
        });
    })
})

app.post('/getAuctioners', (req, res, next) => {
    buyerctl.getAuctionersForItem(req.body.id, (err, data) => {
        if (err) next(err);
        res.send(data);
    })
})

app.post('/placeBid', (req, res, next) => {
    const { userID, itemID, inputBid } = req.body;
    buyerctl.createBuyer(userID, inputBid, itemID, (err, data) => {
        if (err) next(err);
        buyerctl.getAuctionersForItem(req.body.itemID, (err2, data2) => {
            if (err2) next(err2);
            res.send({
                updatedItem: data,
                updatedAuctioners: data2
            });
        })
    })
})

app.post('/autoUpdateBidding',(req,res,next) => {
    const itemID = req.body.itemID;
    buyerctl.getAuctionersForItem(itemID,(err,data) => {
        if(err) next(err);
        itemctl.getOneItem(itemID,(err2,data2) => {
            if(err2) next(err2);
            res.send({
                updatedItem: data2,
                updatedAuctioners: data
            })
        })
    })
})

app.post('/authen', (req, res, next) => {
    const token = req.body.token, userID = req.body.userID;
    userctl.getUserForAuthen(userID, (err, data) => {
        if (err) next(err);
        if (data) {
            try { 
                let same = jwt.verify(token, data.secretKey); 
                if (same) {
                    console.log('User' + userID + ': Authenticate ok at '+Date());
                    res.send({
                        msg: 'Authenticate ok'
                    })
                }
                else {
                    console.log('User' + userID + ': Authenticate failed at '+Date());
                    res.send({
                        msg: 'Authenticate failed'
                    })
                }
            }
            catch (err) {
                // error is fired when token is expired.
                console.log('User' + userID + ': Token expired at '+Date());
                res.send({
                    msg: "Token expired"
                })
            }            
        }
        else {
            console.log('User' + userID + ': Authenticate failed at '+Date());
            res.send({
                msg: 'Authenticate failed'
            })
        }
    })
})

app.post('/getSameCateItems', (req, res, next) => {
    itemctl.getSameCateItems(req.body.cateNum, (err, data) => {
        if (err) next(err);
        let dataResponse = data.map((item, index) => {
            return {
                name: item.name,
                images: item.images,
                currentPrice: item.currentPrice,
                endDate: item.endDate,
                _id: item._id,
                category: item.category
            }
        })
        res.send(dataResponse);
    })
})

app.post('/getUserItem',(req,res,next) => {
    itemctl.getUserItems(req.body.userID,(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

/* The images uploaded are saved on a server in Glitch, only the link to access the image will be saved on MongoDB*/
app.post('/userUploadItem',(req,res,next) => {
    itemctl.createItem({
        userSellID: req.body.userSellID,
        name: req.body.name,
        startingPrice: req.body.startingPrice,
        endDate: req.body.endDate,
        imageName: req.body.imageName,
        descriptionList: req.body.descriptionList
    },(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

app.post('/getCart',(req,res,next) => {
    itemctl.getCart(req.body.userID,(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

app.get('/category',(req,res,next) => {
    // cateID in req.query is string!!!
    itemctl.onSelectCate(req.query.cateID,(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

app.post('/createOrder',(req,res,next) => {
    const {userBoughtID,firstname, lastname,address,phoneNum,email,listOfItems} = req.body;
    orderctl.create({
        userBoughtID: userBoughtID,
        firstname: firstname,
        lastname: lastname,
        address: address,
        phoneNum: phoneNum,
        email: email,
        listOfItems: [...listOfItems]
    },(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

app.get('/getOrder',(req,res,next) => {
    const orderID = req.query.orderID;
    orderctl.getOrder(orderID,(err,data) => {
        if(err) next(err);
        res.send(data);
    })
})

app.post('/checkPendingOrder',(req,res,next) => {
    orderctl.checkPendingOrder(req.body.userBoughtID,(err,data) => {
        if(err) next(err);
        if(data)
        res.send({
            orderID: data.orderID,
            havePendingOrder: true
        })
        else res.send({
            havePendingOrder: false
        })
    })
})