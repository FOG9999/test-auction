const mongoose = require('mongoose');
const Item = require('../models/item');

module.exports = {
    createItem: (information, done) => {
        let imgLinks = information.imageName.map((name,index) => `https://upload-server.glitch.me/public/img/${name}`)
        let newItem = new Item({
            userSellID: information.userSellID,
            name: information.name,
            detail: [...information.descriptionList],
            currentPrice: information.startingPrice,
            images: [...imgLinks],
            beginDate: Date(),
            endDate: information.endDate,
            category: Math.floor(Math.random() * 70)
        })
        newItem.save((err, data) => {
            if (err) console.error(err);
            done(null, data);
        })
    },
    getAllItems: (page, done) => {
        Item.find({})
            .limit(30)
            .skip(30 * (page - 1))
            .exec((err, data) => {
                if (err) console.error(err);
                if (data.length > 0)
                    done(null, {
                        data: data,
                        isLastPage: (data.length === 30) ? false : true
                    });
                else { // empty page => return the lastest page
                    Item.find({})
                        .limit(30)
                        .skip(30 * (page - 2))
                        .exec((err2, prevPage) => {
                            if (err2) console.error(err2);
                            done(null, {
                                isLastPage: true,
                                data: prevPage
                            })
                        })
                }
            })
    },
    getOneItem: (id, done) => {
        Item.findOne({ _id: id }, (err, data) => {
            if (err) console.error(err);
            done(null, data);
        })
    },
    //get alll itemIDs for generating current winners
    getAllItemIDs: (done) => {
        Item.find({}, (err, data) => {
            if (err) console.error(err);
            done(null, data.map(item => item._id));
        })
    },
    getSameCateItems: (cateNum, done) => {
        let cateID = Math.floor(cateNum / 10);
        Item.find({ category: { $gte: cateID * 10, $lt: 10 * (cateID + 1) } })
            .limit(5)
            .populate('userBoughtID')
            .exec((err, data) => {
                if (err) console.error(err);
                done(null, data);
            })
    },
    onSelectCate: (cateID, done) => {
        Item.find({ category: { $gte: Math.ceil(cateID) * 10, $lt: 10 * (Math.ceil(cateID) + 1) } })
            .exec((err, data) => {
                if (err) console.error(err);
                done(null, data);
            })
    },
    getUserItems: (userID, done) => {
        Item.find({ userSellID: userID })
            .populate('userBoughtID')
            .limit(10)
            .exec((err, data) => {
                if (err) console.error(err);
                done(null, data);
            })
    },
    getCart: (userID, done) => {
        Item.find({ userBoughtID: userID, isSold: false }, (err, data) => {
            if (err) console.error(err);
            done(null, data.filter(value => {
                return ((new Date(value.endDate)).getTime() < (new Date()).getTime())
            }));
        })
    }
}