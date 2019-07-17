const express = require('express');
const path = require('path')

const router = express.Router();
const Users = require('../models/users')

router.get('/', (req, res) =>{
    console.log(req.session)
    res.render('Home/Index', {User:req.session.user});
})


router.get('/dashboard', (req, res) =>{
    res.render('Home/Index_Dashboard');
})

router.get('/login', (req, res) =>{
    res.render('Home/Login');
})

router.post('/login', async(req, res) =>{
    const {email, password} = req.body;
    const user = await Users.findOne({ email, password })
    console.log(user)
    if(user != null){
        req.session.user =user; 
        res.redirect("/")
    }else{
        res.redirect('/login')
    }

})

module.exports = router;