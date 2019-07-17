const express = require('express');
const router =  express.Router();

const Zapatos = require('../models/zapatos');
const Cart = require('../models/cart')

router.post('/add', async (req, res) =>{
    
    if(req.session.user == undefined){
        res.json({
            err:"0x403",
            msg:"Usuario no loguedo"
        })
        return;
    }
    
    const { producto, cantidad } = req.body;
    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })

    if(carritos.length > 0){
        var {items} = carritos[0];
        let encontrado =  false;

        items.map(item =>{
            console.log(item._id == producto)
            console.log(item._id)
            console.log(producto)
            if(item._id === producto){
                console.log("Encontrado");
                encontrado = true;
            }
        })

        if(!encontrado){

        }

        res.json({
            status:"0x200",
        })
    }
    else
    {
        const Zapato = await Zapatos.findById(producto)
        const items = []; items.push(Zapato);
        const Carrito = new Cart({idUser:req.session.user._id, items,active:true})
        await Carrito.save();
        res.json({
            status:"0x200",
        })



    }

    res.end()
})

module.exports =router