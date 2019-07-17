const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    idUser:{type:mongoose.SchemaTypes.ObjectId, required:true },
    items:{type:[Object], required:false},
    active:{type:Boolean, required:true, default:true}
})

module.exports = mongoose.model('Cart', CartSchema)