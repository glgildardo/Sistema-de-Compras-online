'use strict'

var User = require("../model/user.model");
var Product = require('../model/product.model');
var Cartshopping = require('../model/cartshopping.model');
var SalesCheck = require('../model/salescheck.model');
var jwt = require('../services/jwt');
var bcrypt = require('bcrypt-nodejs');

function createUser(req,res){
    var body = req.body;
    var user = new User();

    if(body.name && body.nickname && body.password ){
        User.findOne({nickname: body.nickname},(err,userRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(userRepeat){
                res.status(400).send({message:"Este nickname ya esta en uso"});
            }else{
                user.name = body.name;
                user.nickname = body.nickname;
                user.salescheck = body.salescheck;
                user.role = "USER";

                bcrypt.hash(body.password, null,null, (err, passwordEncrypt)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(passwordEncrypt){
                        user.password = passwordEncrypt;
                        
                        user.save((err, userSave)=>{
                            if(err){
                                res.status(500).send({message:"Error general en el servidor"});
                            }else if(userSave){
                                res.send({Usuario: userSave});
                            }else{
                                res.status(404).send({message:"No se logro registrar al usuario"});
                            }
                        });
                    }else{
                        res.status(404).send({message:"No se pudo encriptar la contraseña del usuario"});
                    }
                });
            }
        });
    }else{
        res.status(404).send({message: "Ingrese todos los parametros"});
    }

    
}

function updateUser(req,res){
    var idUser = req.params.id;
    var body = req.body;

    if(req.user.role == 'ADMIN' && req.user.sub == idUser){
        
    }else{
        if(req.user.role == "USER" && req.user.sub == idUser){
            User.findOne({nickname: body.nickname},(err,userRepeat)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor", err});
                }else if(userRepeat){
                    res.status(404).send({message:"Las actualizaciones de usuario que desea realizar no son posibles por razones de uso"});
                }else{
                    if(body.password){
                        bcrypt.hash(body.password,null,null,(err, passwordEncrypt)=>{
                            if(err){
                                res.status(500).send({message:"Error general del servidor", err});
                            }else if(passwordEncrypt){
                                body.password = passwordEncrypt;
                                User.findByIdAndUpdate(idUser,body,{new:true},(err,userUpdate)=>{
                                    if(err){
                                        res.status(500).send({message:"Error general del servidor", err});
                                    }else if(userUpdate){
                                        res.send({Usuario_Actualizado: userUpdate});
                                    }else{
                                        res.status(404).send({message:"No se encontro el usuario al que decea actualizar"});
                                    }
                                });    
                            }else{
                                res.status(404).send({message:"No se logro encriptar la contraseña nueva"});
                            }
                        });
                    }
                }
            });
        }else{
            res.send({message:"No tienes permisos para esta ruta"});
        }   
    }
}

function listUser(req,res){
    var idUser = req.params.id;

    if(req.user.role == "ADMIN"){
        User.find({},(err,listusers)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(listusers){
                res.send({Usuarios: listusers});
            }else{
                res.status(404).send({message:"No se encontraron usuarios en la base de datos"});
            }
        });
    }else{
        res.send({message:"No tienes permisos para esta ruta"});        
    }
    
}

function deleteUser(req,res){
    var idUser = req.params.id;

    if(req.user.role == "USER" && req.user.sub == idUser){
        User.findByIdAndRemove(idUser,(err,userdelete)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(userdelete){
                Cartshopping.deleteMany({_id:userdelete.cartshopping}, (err,deletecart)=>{
                    if(err){
                        res.status(500).send({message:"Error general en el sistema ", err});
                    }else if(deletecart){
                        res.send({message:"Se ha eliminado al usuario exitosamente"});
                    }else{
                        res.status(400).send({message:"No se logro eliminar los carritos asignados al usuario"});
                    }
                })
            }else{
                res.status(400).send({message:"No se logro eliminar al usuario"});
            }
        });
    }else{
        res.send({message:"No tienes permisos para esta ruta"});
    }
}

function login(req, res){
    var body = req.body;

    if(body.nickname && body.password){
        User.findOne({nickname: body.nickname}, (err,userfind)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(userfind){
                bcrypt.compare(body.password, userfind.password, (err, passwordcheak)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(passwordcheak){
                        if(userfind.role =="CLIENT"){
                            if(userfind.salescheck.length <= 0){
                                res.send({Bienvenido: userfind.name,token: jwt.createToken(userfind)});
                            }else if(userfind.userfind.length > 0){
                                res.send({Bienvenido: userfind.salescheck,token: jwt.createToken(userfind)});
                            }
                        }else{
                            res.send({Bienvenido: userfind.name, token: jwt.createToken(userfind)});
                        }
                    }else{
                        res.status(404).send({message:"La contraseña es inconrrecta"});
                    }
                });
            }else{
                res.status(404).send({message:"No se encontro el usuario al que desea logear"});
            }
        });
    }
}

/*function cartshopingadd(req,res){
    var body = req.body;
    var iduser = req.params.id;

    Product.findOne({name: body.nameproduct},(err, productexist)=>{
        if(err){
            res.status(500).send({message:"Error general del servidor", err});
        }else if(productexist){
            var bodyq = Number(body.quantity);
            var bodyp = Number(body.quantity) * Number(productexist.price);

            if(body.quantity <= productexist.quantity){
                User.findOneAndUpdate({'cartshopping.name':productexist.name, 'cartshopping._id': productexist._id}, {"cartshopping.$.quantity":bodyq, "cartshopping.$.price":bodyp},{new:true},(err,productrepeat)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(productrepeat){
                        res.send({productrepeat})
                    }else{
                        var preciototal = Number(body.quantity) * Number(productexist.price);
                        productexist.price = preciototal;
                        productexist.quantity = body.quantity;
    
                        if(body.quantity <= productexist.quantity){
                            User.findByIdAndUpdate(iduser, {$push:{cartshopping:productexist}},{new:true}, (err, setcartshopping)=>{
                                if(err){
                                    res.status(500).send({message:"Error general del servidor", err});
                                }else if(setcartshopping){
                                    res.send({setcartshopping});
                                }else{
                                    res.status(400).send({message:"No se logro meter al carrito de compras el producto"});
                                }
                            });  
                        }else{
                            res.status(400).send({message:"No puede agregar mas producto del que existe en la base de datos"});
                        }
                    }
                });
            }else{
                res.status(400).send({message:"No puede agregar mas producto del que existe en la base de datos"});
            }
            
        }else{
            res.status(404).send({message:"No se encontro el producto que quiere agregar al carrito de compras"});
        }
    });
}*/

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    listUser,
    login
}