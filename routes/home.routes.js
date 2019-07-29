const express = require('express');
const path = require('path')
const paypal = require('paypal-rest-sdk')

const router = express.Router();
const Users = require('../models/users')
const Zapatos = require('../models/zapatos')
const Cart = require('../models/cart')
const Ventas = require('../models/ventas');


//Paypal Config
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'ASAUvCHTC9G2SQn9f8MiLu1jur_F1dL9PSkC_NwJXjvWUDoFBLbL1-PkiA2MGd6RX3r2cG3T12cAp1GK',
    'client_secret': 'ELzNwhM5bnr5s9R5JCPPnpwf8Sx6gy56X0qzuVOGhhHoeNPw0C4jDwCHrwzSBFMbU4nR9bIu1Lew05lp'
  });

//Middleware
const Auth = require('../middlewares/Auth')

router.get('/', async (req, res) =>{
    const AllZapatos = await Zapatos.find();
    res.render('Home/Index', {User:req.session.user, AllZapatos});
})

router.get('/productos',async(req, res)=>{
    const zapatos = await Zapatos.find({stock:{$gt:0}});
    res.render('Home/Productos', {User:req.session.user,zapatos})
})

router.get('/producto/:id', async(req, res)=>{
    const zapato = await Zapatos.findById(req.params.id)
    res.render('Home/Producto', {User:req.session.user,zapato})
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

router.get('/checkout',Auth, async(req,res)=>{
    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })
    res.render('Home/Checkout',{Carrito:carritos[0],User:req.session.user})
})

router.post('/checkout',Auth, async(req, res)=>{
    const { add1, add2, ciudad, phone, zip } = req.body;
    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })
    const carrito = carritos[0];
    const Items = carritos[0].items.map(item =>{
        return {
            "name": item.titulo,
            "sku": item.idProducto,
            "price":item.precio.toFixed(2),
            "quantity":item.cantidad,
            "currency":"MXN"
        }
    })
 
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:3000/success", /*"https://zapateriasur.herokuapp.com/*/
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": Items
            },
            "amount": {
                "currency": "MXN",
                "total": (carrito.total + 300).toFixed(2),
                "details": {
                    "subtotal": carrito.subtotal.toFixed(2),
                    "tax": carrito.iva.toFixed(2),
                    "shipping": "300.00",
                }
            },
            "description": "Compra realizada en Zapaterias del Sur. Gracias por su preferencia."
        }]
    };

    paypal.payment.create(create_payment_json, async function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i=0; i<payment.links.length; i++){
                if(payment.links[i].rel === "approval_url"){
                    const Venta = new Ventas({idUser:req.session.user._id, add1,add2, ciudad, phone, zip, items:Items, subtotal:carrito.subtotal, iva:carrito.subtotal, total:(carrito.total+300), paymentId:payment.id, status:0})
                    await Venta.save();
                    res.redirect(payment.links[i].href)
                }
            }
        }
    });
})

router.get('/success', Auth, async (req, res) =>{
    const PayerID = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const carritos = await Cart.find({ idUser:req.session.user._id, active:true })
    const carrito = carritos[0];

    const execute_payment_json = {
        "payer_id": PayerID,
        "transactions": [{
            "amount": {
                "currency": "MXN",
                "total": (carrito.total + 300).toFixed(2)
            }
        }]
    }

    paypal.payment.execute(paymentId, execute_payment_json, async(error, payment)=>{
        if(error){
            console.log(error)
            console.log(error.response.details)
            throw error;
        }
        else{
                        
            await Ventas.updateOne({paymentId: paymentId}, {status:1, PayerID})
            await Cart.updateOne({idUser:req.session.user._id, active:true},{active:false})

            const Venta = await Ventas.find({paymentId})
            Venta[0].items.map(async item => {
                const Zapato = await Zapatos.findById(item.sku)
                await Zapatos.updateOne({_id:item.sku}, {stock:Zapato.stock-item.quantity})
            })

            res.render('Home/Success',{User:req.session.user, Venta:Venta[0]})
        }
    })

});

router.get('/cancel',Auth, async(req,res)=>{
    const token = req.query.token; 
    await Ventas.deleteOne({cancelId:token})
    res.render('Home/Cancel',{User:req.session.user})
});

router.get('/tracking', async(req, res)=>{
    res.render('Home/Tracking',{User:req.session.user} )
})
router.post('/tracking', async(req, res)=>{
    const {OrdenID} = req.body;
    const Venta = await Ventas.findById(OrdenID)
    console.log(Venta)
    res.json(Venta);
})

module.exports = router;