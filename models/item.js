const mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
    userSellID: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String
    },
    detail: [{}],
    category: {
        type: Number
    },
    images :[{
        type: String
    }],
    currentPrice: {
        type: Number
    },
    originalPrice: { 
        type: Number
    },
    beginDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    userBoughtID: {
        type: mongoose.Types.ObjectId,
        default: null,
        ref: 'User'
    },
    isSold: {
        type: Boolean
    },
    sellerPhone: {
        type: String
    },
    sellerAddress: {
        type: String
    },
    auctionFeeType: { // 0: $5, 1: 5% of final price, 2: 10% of final price
        type: Number
    }
})

module.exports = mongoose.model("Item",ItemSchema);