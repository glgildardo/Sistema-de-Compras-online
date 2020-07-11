'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var salescheckSchema = Schema({
    name: String,
    date: Date,
    nit: String,
    products: [{
        name: String,
        quantity: Number,
        price: Number,
    }],
    total:Number
});

module.exports = mongoose.model('salescheck', salescheckSchema);