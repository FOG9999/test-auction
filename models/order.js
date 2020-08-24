const mongoose = require('mongoose');

const Order = mongoose.Schema({
    userBoughtID: {
        type: mongoose.Types.ObjectId
    },
    listOfItems: [{
        type: mongoose.Types.ObjectId,
        ref: 'Item'
    }],
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String
    },
    phoneNum: {
        type: String
    },
    deliveried: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date
    },
    isPaidAt: {
        type: Date
    }
})

module.exports = mongoose.model('Order',Order);