const express = require('express');
const router = express.Router();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

//Config Clodinary
cloudinary.config({ 
    cloud_name: 'pat9', 
    api_key: '481118882942431', 
    api_secret: 'ZiGf8m8U772_wHl-Oa0VMvymB4o' 
});
  

//Config Multer
const storage = multer.diskStorage({
    destination:path.join(__dirname,'../temp/img'),
    filename:(req,file,callback) =>{
        callback(null, path.basename(file.originalname))
    }
})
const upload = multer({storage})
//Model
const Zapatos = require('../models/zapatos')

router.get('/', async (req, res) =>{
    const AllZapatos = await Zapatos.find();
    res.render('Zapatos/Index', {Zapatos:AllZapatos})
})

router.get('/Create', (req, res) =>{
    res.render('Zapatos/Create')
})

router.post('/Create',upload.single('imagen'), async (req,res) => {
    const { titulo, descripcion, precio, stock } = req.body;

    let imagen = {};
    await cloudinary.uploader.upload(req.file.path, (error, result) => {
        if(!error){
            imagen = result;
        }
        else{
            console.log(error)
            res.json({status:"Error in cloudinary"})
        }
    })

    const Zapato = new Zapatos({titulo, descripcion, precio, stock, imagen});
    await Zapato.save();

    res.redirect('/Zapatos')
})

router.get('/Edit/:id', async (req, res) =>{
    const Zapato = await Zapatos.findById(req.params.id)
    res.render('Zapatos/Edit', {Zapato}) 
})

router.post('/Edit/:id',upload.single('imagen'), async(req, res) =>{
    const { titulo, descripcion, precio, stock } = req.body;
    if(req.file != undefined){
        let imagen = {};
        await cloudinary.uploader.upload(req.file.path, (error, result) => {
            if(!error){
                imagen = result;
            }
            else{
                console.log(error)
                res.json({status:"Error in cloudinary"})
            }
        })

        await Zapatos.findByIdAndUpdate(req.params.id, {titulo, descripcion, precio, stock, imagen});
        res.redirect('/Zapatos')
    }

    await Zapatos.findByIdAndUpdate(req.params.id, {titulo, descripcion, precio, stock});
    res.redirect('/Zapatos')


})

router.get('/Delete/:id', async(req, res) =>{
    await Zapatos.findOneAndDelete({_id: req.params.id})
    res.redirect('/Zapatos')
})

module.exports = router;