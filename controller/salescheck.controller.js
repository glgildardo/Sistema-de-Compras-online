'use strict'

var SalesCheck = require('../model/salescheck.model');
var Cartshopping = require('../model/cartshopping.model');
var User = require('../model/user.model');
var Product = require('../model/product.model');
var moment = require('moment');

//Que se guarde cuando guarde un parametro especifico
function createSalesCheck(req, res){
    var idUser = req.params.id;
    var salescheck = new SalesCheck();
    var body = req.body;
    if(req.user.role == 'USER' && req.user.sub == idUser){
        User.findById(idUser,{cartshopping:1},(err,user)=>{
            if(err){
                res.status(500).send({message:"Error general del sistemal", err});
            }else if(user){        
                if(user.cartshopping.length > 0){
                    //res.send({message:"Si lo lee"});
                    salescheck.name = user.name;
                    salescheck.nit = user.nit;
                    var date = new Date(moment().format('YYYY MM DD'));
                    salescheck.date = date;
                    var subtotal= 0;
                    var deleteCar = [];
    
                    user.cartshopping.forEach(producto => {
                        Cartshopping.findOne({name:producto.name},(err,productexist)=>{
                            if(err){
                                res.status(500).send({message:"Error general en el sistema " ,err})
                            }else if(productexist){
                                var products = {
                                    name: String,
                                    quantity: Number,
                                    price: Number,
                                    total: Number
                                }
                                products._id = productexist._id;
                                products.name = productexist.name;
                                products.quantity = productexist.quantity;
                                products.price = productexist.price;
                                subtotal = subtotal + productexist.price;
                                salescheck.total = subtotal;
                                salescheck.products.push(products);
                                
                                if(user.cartshopping.indexOf(producto) == user.cartshopping.length-1){
                                    salescheck.save((err,salescheckSave)=>{
                                        if(err){
                                            res.status(500).send({message:"Error general en el sistema " ,err})
                                        }else if(salescheckSave){
                                            res.send({Facgtura_Generada: salescheckSave});
                                            user.cartshopping.forEach(produc => {
                                                Product.findOne({name: produc.name},(err,findproduct)=>{
                                                    if(err){
                                                        res.status(500).send({message:"Error general en el sistema " ,err})
                                                    }else if(findproduct){
                                                        var quantitys = Number(findproduct.quantity) - Number(produc.quantity);
                                                        var compra = Number(findproduct.sales) + Number(produc.quantity);
                                                        console.log(findproduct.sales)
                                                        console.log(produc.quantity)
                                                        Product.findOneAndUpdate({name:produc.name},{quantity:quantitys, sales:compra},{new:true},(err,productUpdate)=>{
                                                            if(err){
                                                                console.log('se logro hasta actualizar los pero dio error', err)
                                                                res.status(500).send({message:"Error general en el sistema " ,err})
                                                            }else if(productUpdate){
                                                                console.log('se logro hasta actualizar los productos')
                                                                if(user.cartshopping.indexOf(produc) == user.cartshopping.length-1){
                                                                    console.log(produc);
                                                                    Cartshopping.deleteMany({_id:produc._id},(err,cartshoppingdeleted)=>{
                                                                        if(err){
                                                                            console.log("No se pudo eliminar porque dio error");
                                                                            res.status(500).send({message:"Error general en el sistema " ,err})
                                                                        }else if(productexist){
                                                                            User.findByIdAndUpdate(idUser,{cartshopping:deleteCar, $push:{salescheck:salescheckSave}},{new:true},(err,deletecartUser)=>{
                                                                                if(err){
                                                                                    res.status(500).send({message:"Error general en el sistema " ,err})
                                                                                }else if(deletecartUser){
                                                                                    console.log(cartshoppingdeleted);
                                                                                    console.log("Eliminacion de carrito con exito");
                                                                                }else{
                                                                                    res.status(400).send({message:"No se logro meter la factura al usuario"});
                                                                                }   
                                                                            })
                                                                            console.log(cartshoppingdeleted);
                                                                            console.log("Eliminacion de carrito con exito");
                                                                        }else{
                                                                            console.log("No se pudo eliminar los carritos ya que no los encontro");
                                                                            res.status(404).send({message:"No se eliminaron los carritos"});
                                                                        }
                                                                    });
                                                                }
                                                            }else{
                                                                console.log('se logro hasta actualizar pero no se actualizo')
                                                                res.status().send({message:"No se encontro el producto"});
                                                            }
                                                        });
                                                    }else{
                                                        res.status(400).send({message:"No se encontro el producto al cual se le eliminara la cantidad comprada"});
                                                    }    
                                                })
                                            });
                                        }else{
                                            res.status(400).send({message:"No se logro registrar la factura"});
                                        }
                                    });
                                }
                            }else{
                                res.status(400).send({message:"No se encontro producto alguno en el carrito"});
                            }
                        });
                    });
                }else{
                    res.send({message:"No hay productos para generar la factura"});
                }     
            }else{
                res.status(404).send({message:"No se encontro al usuario que se generara la factura"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    } 
}

function listSalesCheck(req, res){
    var iduser = req.params.id;

    if(req.user.sub == iduser){
        User.findById(iduser,{salescheck:1}, (err, userfind)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor"});
            }else if(userfind){
                res.send({Facturas: userfind.salescheck});
            }else{
                res.status(404).send({message:"No se encontro al usuario que quiere listar sus facturas"});
            }
        }).populate('salescheck');
    }else{
        res.status(403).send({message:"No tienes permisos para esta ruta"});
    }
    
}

function productSalescheak(req, res){
    var iduser = req.params.id;
    var idsalescheak = req.params.ids;

    if(req.user.sub == iduser){
        SalesCheck.findById(idsalescheak,{'products.name':1}, (err, salescheckfind)=>{
            if(err){
                res.status(500).send({message:"Error general en el servidor"});
            }else if(salescheckfind){
                res.send({Productos: salescheckfind});
            }else{
                res.status(404).send({message:"No se encontro al usuario que quiere listar sus facturas"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }    
}

module.exports = {
    createSalesCheck,
    listSalesCheck,
    productSalescheak
}