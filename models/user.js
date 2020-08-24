const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    hashedPassword: {
        type: String
    },
    secretKey: {
        type: String
    },
    token :{
        type: String
    }
})

module.exports = mongoose.model('User',UserSchema);