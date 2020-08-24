const Buyer = require('../models/buyer');
const Item = require('../models/item');

module.exports = {
    createBuyer: (userID, givenPrice, itemID, done) => {
        let newBuyer = new Buyer({
            userID: userID,
            auctionAt: Date(),
            givenPrice: givenPrice,
            itemAuctionID: itemID
        });
        newBuyer.save((err3, data2) => {
            if (err3) console.error(err3);
            Buyer.find({ itemAuctionID: itemID }, (err, data) => {
                if (err) console.error(err);
                //console.log(data)
                let currWinner = data[0];
                data.forEach((value, index) => {
                    if(value._doc.givenPrice > currWinner._doc.givenPrice){
                        currWinner = { ...value };
                    }
                })
                Item.findOneAndUpdate({ _id: itemID }, {
                    currentPrice: currWinner._doc.givenPrice,
                    userBoughtID: currWinner._doc.userID
                }, { useFindAndModify: false, new: true }, (err2, updated) => {
                    if (err2) console.error(err2);
                    done(null, updated);
                })
            })
        });
    },
    getBuyersAndSellers: (done) => {
        Buyer.find({})
            .populate('userID')
            .populate('itemAuctionID')
            .exec((err, dt) => {
                if (err) console.error(err);
                done(null, dt);
            })
    },
    // set up for generated data
    getAuctionersForItem: (itemID, done) => {
        Buyer.find({ itemAuctionID: itemID })
            .populate('userID')
            .populate('itemAuctionID')
            .exec((err, data) => {
                if (err) console.error(err);
                done(null, data.map((d, i) => {
                    return {
                        auc: {
                            userID: d.userID._id,
                            name: d.userID.name,
                            email: d.userID.email
                        },
                        givenPrice: d.givenPrice,
                        auctionAt: d.auctionAt
                    }
                }));
            })
    }
}