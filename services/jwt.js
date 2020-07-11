'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_secreta_1234';

exports.createToken = (client)=>{
    var payload ={
        sub: client._id,
        name: client.name,
        nickname: client.nickname,
        role: client.role,
        iat: moment().unix(),
        exp: moment().add(15, 'days').unix
    }

    return jwt.encode(payload, key);
}