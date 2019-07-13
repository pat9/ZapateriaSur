const express = require('express');
const morgan = require('morgan');

//Express
const app = express();

//Config
app.set('PORT', process.env.PORT||3000);

//Middleware
app.use(morgan('dev'));

//Routes

//Server Listen
app.listen(app.get('PORT'), _ => console.log(`server is runing ${app.get('PORT')}`))

