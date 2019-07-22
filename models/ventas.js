const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
    idUser:{type:mongoose.SchemaTypes.ObjectId, required:true },
    add1:{type:String, required:false},
    add2:{type:String, required:false},
    phone:{type:String, required:false},
    ciudad:{type:String, required:false},
    zip:{type:String, required:false},
    items:{type:[Object], required:false},
    subtotal:{type:Number, require:true},
    iva:{type:Number, require:true},
    total:{type:Number, require:true},
    paymentId:{type:String, required:false},
    PayerID:{type:String, required:false},
    cancelId:{type:String, required:false},
    date:{type:Date, required:false, default:Date()},
    status:{type:Number, required:true, default:0} // 0 Process, 1 Payed, 2 Send, 
})

module.exports = mongoose.model('Ventas', VentaSchema)