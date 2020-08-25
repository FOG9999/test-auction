const Order = require('../models/order');
const Item  = require('../models/item');

module.exports = {
    create: (inputInfo,done) => {
        let newOrder = new Order({
            userBoughtID: inputInfo.userBoughtID,
            firstname: inputInfo.firstname,
            lastname: inputInfo.lastname,
            address: inputInfo.address,
            phoneNum: inputInfo.phoneNum,
            email: inputInfo.email,
            listOfItems: [...inputInfo.listOfItems],
            createdAt: new Date(),
            total: inputInfo.total
        })
        Item.updateMany({_id: {$in: inputInfo.listOfItems}},{isSold: true},(err2,data2) => {
            if(err2) console.error(err);
            console.log(data2);
        })
        newOrder.save((err,data) => {
            if(err) console.error(err);
            done(null,data);
        })
    },
    getOrder: (orderID,done) => {
        Order.findOne({_id: orderID})
        .populate('listOfItems')
        .exec((err,data) => {
            if(err) console.error(err);
            done(null,data);
        })
    },
    checkPendingOrder: (userBoughtID,done) => {
        Order.findOne({userBoughtID: userBoughtID, deliveried: false},(err,data) => {
            if(err) console.error(err);
            if(data) done(null,{
                orderID: data._id
            });
            else done(null,false)
        })
    }
}