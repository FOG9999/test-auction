const mongoose = require('mongoose');

var BuyerSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    auctionAt: {
        type: Date
    },
    givenPrice: {
        type: Number
    },
    itemAuctionID:{
        type: mongoose.Types.ObjectId,
        ref: 'Item'
    }
})

module.exports = mongoose.model("Buyer",BuyerSchema);