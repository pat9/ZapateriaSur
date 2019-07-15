const express = require('express');
const path = require('path')

const router = express.Router();

router.get('/', (req, res) =>{
    res.render('Home/Index');
})


router.get('/dashboard', (req, res) =>{
    res.render('Home/Index_Dashboard');
})


module.exports = router;