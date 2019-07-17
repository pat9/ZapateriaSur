const express = require('express');
const morgan = require('morgan');
const path = require('path')
const session = require('express-session')

//Express
const app = express();

//Database
require('./models/database')

//Config
app.set('PORT', process.env.PORT||3000);
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')

//Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}))
app.use(session({secret:'HEY'}))

//Routes
app.use('/', require('./routes/home.routes'))
app.use('/Zapatos', require('./routes/zapatos.routes'))
app.use('/Users', require('./routes/users.routes'))

//Server Listen
app.listen(app.get('PORT'), _ => console.log(`server is runing ${app.get('PORT')}`))