'use strict'

var moongose = require('mongoose');
var Schema = moongose.Schema;

var userSchema = Schema({
    name: String,
    nickname: String,
    password: String,
    nit:String,
    role: String,
    salescheck: [{type: Schema.Types.ObjectId, ref:"salescheck"}],
    cartshopping: [{
        name: String,
        quantity: Number,
        price: Number
    }]        
});

module.exports = moongose.model('user', userSchema);
