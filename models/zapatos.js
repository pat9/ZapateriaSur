const mongoose = require('mongoose');

const ZapatosSchema = new mongoose.Schema({
    titulo:{type:String, required:true},
    descripcion:{type:String, required:true},
    precio:{type:Number, required:true},
    stock:{type:String, required:true},
    imagen:{type:Object, required:true}

})

module.exports = mongoose.model('Zapatos', ZapatosSchema);