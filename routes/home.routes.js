const express = require('express');
const path = require('path')

const router = express.Router();
const Users = require('../models/users')
const Zapatos = require('../models/zapatos')

router.get('/', async (req, res) =>{
    console.log(req.session)
    const AllZapatos = await Zapatos.find();
    res.render('Home/Index', {User:req.session.user, AllZapatos});
})


router.get('/dashboard', (req, res) =>{
    res.render('Home/Dashboard');
})

router.get('/login', (req, res) =>{
    res.render('Home/Login');
})

router.get('/register', (req, res) =>{
    res.render('Home/Register');
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