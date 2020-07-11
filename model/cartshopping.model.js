'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cartshoppingSchema = Schema({
    name: String,
    quantity: Number,
    price: Number
});

module.exports = mongoose.model('cartshopping', cartshoppingSchema);