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
        var {_id,items} = carritos[0];
        let encontrado =  false;

        items = items.map(item =>{
            if(item.idProducto == req.body.producto){
                console.log("Entre aqui")
                item.cantidad += cantidad;
                encontrado = true;
                return item;
            }
            else{
                console.log("Entre aca")

                return item;
            }
        })

        if(!encontrado){
            const Zapato = await Zapatos.findById(producto)
            const item = { idProducto: Zapato._id, precio:Zapato.precio, cantidad }
            items.push(item);
        }
        await Cart.findByIdAndUpdate(_id, {items})
        res.json({
            status:"0x200",
        })
    }
    else
    {
        const Zapato = await Zapatos.findById(producto)
        const item = { idProducto: Zapato._id, precio:Zapato.precio, cantidad }
        const items = []; items.push(item);
        const Carrito = new Cart({idUser:req.session.user._id, items,active:true})
        await Carrito.save();
        res.json({
            status:"0x200",
        })



    }

    res.end()
})

module.exports =router