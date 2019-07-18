const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
    idUser:{type:mongoose.SchemaTypes.ObjectId, required:true },
    items:{type:[Object], required:false},
    subtotal:{type:Number, require:true},
    iva:{type:Number, require:true},
    total:{type:Number, require:true},
    active:{type:Boolean, required:true, default:true}
})

module.exports = mongoose.model('Cart', CartSchema)