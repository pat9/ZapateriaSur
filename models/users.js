const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    nombre:{type:String, required:true},
    apellidos:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    isAdmin:{type:Boolean, require:true}
})

module.exports = mongoose.model('users', usersSchema)