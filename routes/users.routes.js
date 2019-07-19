const express = require('express');
const router = express.Router();

//Model
const Users = require('../models/users')

//Middlewares
router.use(require('../middlewares/Auth'))

router.get('/', async (req, res) =>{
    const AllUsers = await Users.find();
    res.render('Users/Index', {Users:AllUsers,User:req.session.user , users:true})
})

router.get('/Create', (req, res) =>{
    res.render('Users/Create',{User:req.session.user , users:true})
})

router.post('/Create', async (req,res) => {
    const { nombre, apellidos, email, password } = req.body;

    const User = new Users({nombre, apellidos, email, password, isAdmin:true});
    await User.save();

    res.redirect('/Users')
})

router.get('/Edit/:id', async (req, res) =>{
    const User = await Users.findById(req.params.id)
    res.render('Users/Edit', {User,User:req.session.user , users:true}) 
})

router.post('/Edit/:id', async(req, res) =>{
    const { nombre, apellidos, email, password } = req.body;
    
    await Users.findByIdAndUpdate(req.params.id, {nombre, apellidos, email, password });
    res.redirect('/Users')


})

router.get('/Delete/:id', async(req, res) =>{
    await Users.findOneAndDelete({_id: req.params.id})
    res.redirect('/Users')
})

module.exports = router;