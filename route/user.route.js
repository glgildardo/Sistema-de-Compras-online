'use strict'

var userController = require('../controller/user.controller');
var authentification = require('../middleware/authenticated');
var express = require('express');
var api = express.Router();

api.post('/createUser', userController.createUser);
api.put('/updateUser/:id', authentification.ensureAuth,userController.updateUser);
api.delete('/deleteUser/:id', authentification.ensureAuth,userController.deleteUser);
api.get('/listUsers',authentification.ensureAuthAdmin, userController.listUser);

//login
api.put('/login', userController.login);

module.exports = api;
