const express = require('express');
const router =  express.Router();

//Models
const Zapatos = require('../models/zapatos');
const Cart = require('../models/cart')

//Middlewares
const Auth = require('../middlewares/Auth')

router.get('/', Auth, async (req, res) =>{
    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })
    res.render('Cart/Index', {Carrito:carritos[0],User:req.session.user}) 
})

router.post('/add', async (req, res) =>{
    
    if(req.session.user == undefined){
        res.json({
            err:"0x403",
            msg:"Usuario no loguedo"
        })
        return;
    }
    
    const revision = await Zapatos.findById(req.body.producto);
    

    const { producto, cantidad } = req.body;
    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })

    if(carritos.length > 0){
        var {_id,items} = carritos[0];
        let encontrado =  false;
        let suma = 0;
        let error = false;
        items = items.map(item =>{
            if(item.idProducto == req.body.producto){
                if(item.cantidad+cantidad > revision.stock){
                    res.json({
                        err:"0x405",
                        msg:"Execde el stock"
                    })
                    error=true;
                    
                }
                item.cantidad += cantidad;
                encontrado = true;
                suma+= item.cantidad * item.precio;
                item.subtotal = item.cantidad * item.precio;
                return item;
            }
            else{
                suma+= item.cantidad * item.precio;
                return item;
            }
        })
        if(error)return;

        if(!encontrado){
            const Zapato = await Zapatos.findById(producto)
            const item = { idProducto: Zapato._id, precio:Zapato.precio, imagen:Zapato.imagen,titulo:Zapato.titulo, subtotal:(Zapato.precio*cantidad), cantidad }
            suma+= cantidad * Zapato.precio;
            items.push(item);
        }
        const subtotal = suma;
        const iva = subtotal * .16;
        const total  = subtotal + iva;
        const carro = await Cart.findByIdAndUpdate(_id, {items, subtotal, iva, total})
        res.json({
            carrito:{_id, items, subtotal, iva,total},
            status:"0x200",
        })
    }
    else
    {
        const Zapato = await Zapatos.findById(producto)
        const item = { idProducto: Zapato._id, precio:Zapato.precio, imagen:Zapato.imagen,titulo:Zapato.titulo, subtotal:(Zapato.precio*cantidad), cantidad }
        const items = []; items.push(item);
        const subtotal = Zapato.precio * cantidad;
        const iva = subtotal * .16;
        const total  = subtotal + iva;
        const Carrito = new Cart({idUser:req.session.user._id, items,subtotal, iva, total,active:true})
        const carro = await Carrito.save();
        res.json({
            carrito:carro,
            status:"0x200",
        })



    }

    res.end()
})

router.post('/remove', async (req, res) =>{
    
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
        let suma = 0;
        items = items.map(item =>{
            if(item.idProducto == req.body.producto){
                item.cantidad -= cantidad;
                encontrado = true;
                suma+= item.cantidad * item.precio;
                item.subtotal = item.cantidad * item.precio;
                return item;
                
            }
            else{
                suma+= item.cantidad * item.precio;
                return item;
            }
        })

        items = items.filter(item =>{
            if(item.cantidad > 0) return item;
        })

        if(!encontrado){
            const Zapato = await Zapatos.findById(producto)
            const item = { idProducto: Zapato._id, precio:Zapato.precio, imagen:Zapato.imagen,titulo:Zapato.titulo, subtotal:(Zapato.precio*cantidad), cantidad }
            suma+= cantidad * Zapato.precio;
            items.push(item);
        }
        const subtotal = suma;
        const iva = subtotal * .16;
        const total  = subtotal + iva;
        const carro = await Cart.findByIdAndUpdate(_id, {items, subtotal, iva, total})
        res.json({
            carrito:{_id, items, subtotal, iva,total},
            status:"0x200",
        })
    }
    else
    {
        const Zapato = await Zapatos.findById(producto)
        const item = { idProducto: Zapato._id, precio:Zapato.precio, imagen:Zapato.imagen,titulo:Zapato.titulo, subtotal:(Zapato.precio*cantidad), cantidad }
        const items = []; items.push(item);
        const subtotal = Zapato.precio * cantidad;
        const iva = subtotal * .16;
        const total  = subtotal + iva;
        const Carrito = new Cart({idUser:req.session.user._id, items,subtotal, iva, total,active:true})
        const carro = await Carrito.save();
        res.json({
            carrito:carro,
            status:"0x200",
        })



    }

    res.end()
})

module.exports =router