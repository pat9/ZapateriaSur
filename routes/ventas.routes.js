const express = require('express');
const router = express.Router();

//Models
const Ventas = require("../models/ventas")

//Middlewares
router.use(require('../middlewares/Auth'))

router.get("/", async(req, res)=>{
    res.render('Ventas/Index')
})


module.exports = router;