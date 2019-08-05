const express = require('express');
const router = express.Router();
const mongoose=require('mongoose')

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
    res.render('Ventas/Index',{User:req.session.user, ventas})
})

router.get('/:id', async(req, res)=>{
  console.log(req.params.id)
  const Venta = await Ventas.aggregate([
    {
      '$match': {
        '_id': mongoose.Types.ObjectId(req.params.id)
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'idUser', 
        'foreignField': '_id', 
        'as': 'usuario'
      }
    }
  ])
  res.render('Ventas/Venta',{User:req.session.user, Venta:Venta[0],ventas:true})
})

router.get('/Cambiar/:id', async(req, res)=>{

  await Ventas.updateOne({_id:req.params.id}, {status:2});

  res.json("OK")

})

module.exports = router;