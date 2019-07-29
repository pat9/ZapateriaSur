const express = require('express');
const router = express.Router();

//Models
const Ventas = require("../models/ventas")

//Middlewares
router.use(require('../middlewares/Auth'))

router.get("/", async(req, res)=>{
    const ventas = await Ventas.aggregate([
        { $lookup:
           {
             from: 'users',
             localField: 'idUser',
             foreignField: '_id',
             as: 'usuario'
           }
         }
        ])
    console.log(ventas[0].usuario)
    res.render('Ventas/Index',{User:req.session.user, ventas})
})


module.exports = router;