const express = require('express');
const path = require('path')

const router = express.Router();
const Users = require('../models/users')
const Zapatos = require('../models/zapatos')

//Middleware
const Auth = require('../middlewares/Auth')

router.get('/', async (req, res) =>{
    const AllZapatos = await Zapatos.find();
    res.render('Home/Index', {User:req.session.user, AllZapatos});
})


router.get('/dashboard',Auth, (req, res) =>{
    if(!req.session.user.isAdmin) res.redirect("/")
    res.render('Home/Dashboard',{User:req.session.user, dashboard:true});
})

router.get('/login', (req, res) =>{

    if(req.session.user !=undefined) res.redirect("/");

    res.render('Home/Login' );
})


router.post('/login', async(req, res) =>{
    const {email, password} = req.body;
    const user = await Users.findOne({ email, password })
    if(user != null){
        req.session.user =user; 
        res.redirect("/")
    }else{
        res.render('Home/Login',{err:"Correo o contraseña incorrectos"})
    }

})

router.get('/register', (req, res) =>{
    if(req.session.user !=undefined) res.redirect("/");
    res.render('Home/Register');
})

router.post('/register', async(req, res) =>{
    const { nombre, apellidos, email, password } = req.body;

    const User = new Users({nombre, apellidos, email, password, isAdmin:false});
    await User.save();

    req.session.user = User;

    res.redirect('/')
})

router.get('/logout', (req, res) =>{
    if(req.session.user == undefined) res.redirect("/");
    delete req.session.user;
    res.redirect("/")
})

router.get('/checkout',Auth, (req,res)=>{
    res.render('Home/Checkout')
})

module.exports = router;