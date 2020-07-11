'use strict'

var CartshoppingController = require('../controller/cartshopping.controller');
var authentification = require('../middleware/authenticated');
var express = require('express');
var api = express.Router();

api.post("/createproductCartshopping/:id", authentification.ensureAuth,CartshoppingController.addcartshopping);
api.delete('/deleteproductCartshopping/:id/:idC', authentification.ensureAuth,CartshoppingController.deletecartshopping);
module.exports = api;