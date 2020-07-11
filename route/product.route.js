'use strict'

var ProductController = require('../controller/product.controller');
var authentification = require('../middleware/authenticated');
var express = require('express');
var api = express.Router();

api.post('/createProduct', authentification.ensureAuthAdmin,ProductController.createProduct);
api.put('/updateProduct/:id', authentification.ensureAuthAdmin, ProductController.updateProduct);
api.delete('/deleteProduct/:id', authentification.ensureAuthAdmin,ProductController.deleteProduct);
api.get('/listProduct', authentification.ensureAuth,ProductController.listProduct);

//Agregar al la cantidad del product
api.put('/addStock/:id', authentification.ensureAuthAdmin,ProductController.addStock);

//Buscar el producto por su nombre
api.put('/searchProduct', authentification.ensureAuth,ProductController.searchProduct);

//Buscar productos agotados
api.get('/productAgot', authentification.ensureAuth,ProductController.productAgot);

//Buscar productos mas vendidos
api.get('/productosMasVendidos', authentification.ensureAuth,ProductController.productmaxSales);
module.exports = api;