const express = require('express');
const morgan = require('morgan');
const path = require('path')

//Express
const app = express();

//Config
app.set('PORT', process.env.PORT||3000);
app.use(express.static(path.join(__dirname, '/public')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')

//Middleware
app.use(morgan('dev'));

//Routes
app.use('/', require('./routes/home.routes'))

//Server Listen
app.listen(app.get('PORT'), _ => console.log(`server is runing ${app.get('PORT')}`))