'use strict'

var CategoryController = require('../controller/category.controller');
var authentification = require('../middleware/authenticated');
var express = require('express');
var api = express.Router();

api.post('/createCategory/:id', authentification.ensureAuthAdmin,CategoryController.createCategory);
api.put('/updateCategory/:id/:idU', authentification.ensureAuthAdmin,CategoryController.updateCategory);
api.delete('/deleteCategory/:id/:idU', authentification.ensureAuthAdmin,CategoryController.deleteCategory);
api.get('/listCategorys/:id', authentification.ensureAuth,CategoryController.listCategorys);

// Listar las categorias existentes y sus productos
api.get('/listCategorysProduct/:id', authentification.ensureAuth,CategoryController.CategorysProducts);

module.exports = api;
