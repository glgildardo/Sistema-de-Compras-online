'use strict'

var Cartshopping = require('../model/cartshopping.model');
var Product = require('../model/product.model');
var User = require('../model/user.model');

function addcartshopping(req, res) {
    var iduser = req.params.id;
    var body = req.body;
    var cartshopping = new Cartshopping();

    if(req.user.role == 'USER' && req.user.sub == iduser){
        if(body.nameproduct && body.quantity){
            Product.findOne({name:body.nameproduct},(err,productexist)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor", err});
                }else if(productexist){
                    var bodyp = Number(productexist.price) * Number(body.quantity);
                    Cartshopping.findOneAndUpdate({name:body.nameproduct},{price:bodyp, quantity:body.quantity},{new:true},(err,productoEupdate)=>{
                        if(err){
                            res.status(500).send({message:"Error general del servidor", err});
                        }else if(productoEupdate){
                            res.send({message:productoEupdate});
                        }else{
                            cartshopping.name = productexist.name;
                            cartshopping.quantity = body.quantity;
                            cartshopping.price = Number(productexist.price) * Number(body.quantity);
        
                            cartshopping.save((err,cartshoppingadd)=>{
                                if(err){
                                    res.status(500).send({message:"Error general del servidor", err});
                                }else if(cartshoppingadd){
                                    User.findByIdAndUpdate(iduser, {$push:{cartshopping:cartshoppingadd}},{new:true},(err,usercart)=>{
                                        if(err){
                                            res.status(500).send({message:"Error general del servidor", err});
                                        }else if(usercart){
                                            res.send({Se_agrego_al_Carrito: cartshoppingadd});
                                        }else{
                                            res.status(400).send({message:"No se encontro el usuario al que se le agregara el producto del carrito"});
                                        }
                                    });
                                }else{
                                    res.status(400).send({message:"No se pudo agregar nada al carrito", cartshoppingadd});
                                }
                            });
                        }
                    });
                }else{
                    res.status(400).send({message:"No existe el producto en la base de datos"});
                }
            });
        }else{
            res.status(404).send({message:"Ingrese todos los parametros"});
        }
    }else{
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }    
}

function deletecartshopping(req, res){
    var iduser = req.params.id;
    var idcarrito = req.params.idC;

    if(req.user.role == 'USER' && req.user.sub == iduser){
        Cartshopping.findByIdAndRemove(idcarrito,(err,deletedcarrito)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(deletedcarrito){
                User.findByIdAndUpdate(iduser,{$pull:{cartshopping: idcarrito}},{new:true},(err,carritouserdelete)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(carritouserdelete){
                        res.send({Carrito_Eliminado: "Carrito Eliminado"});
                    }else{
                        res.status(400).send({message:"No se logro eliminar el carrito del usuario"});
                    }            
                });
            }else{
                res.status(400).send({message:"No se encontro el producto dentro dentro del carrito"});
            }
        });
    }else{
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }
}



/*function name(req, res) {
    
}*/

module.exports = {
    addcartshopping,
    deletecartshopping
}