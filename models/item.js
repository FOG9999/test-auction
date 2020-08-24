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
    finalPrice: { // this field is redundant
        type: Number,
        default: 0
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
    }
})

module.exports = mongoose.model("Item",ItemSchema);