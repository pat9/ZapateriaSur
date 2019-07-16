const moongose = require('mongoose');

moongose.connect("mongodb://localhost/zapateria", {useNewUrlParser:true}).then(_ => console.log('Database is connected'));

module.exports = moongose;