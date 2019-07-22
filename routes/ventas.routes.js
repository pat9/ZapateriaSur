const express = require('express');
const router = express.Router();

//Models
const Ventas = require("../models/ventas")

//Middlewares
router.use(require('../middlewares/Auth'))

router.get("/", async(req, res)=>{
    
})


module.exports = router;