const moongose = require('mongoose');

moongose.connect("mongodb://zapateria:Be424~LRh-9s@den1.mongo1.gear.host:27001/zapateria", {useNewUrlParser:true}).then(_ => console.log('Database is connected'));

module.exports = moongose;