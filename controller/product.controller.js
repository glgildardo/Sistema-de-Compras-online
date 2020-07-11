'use strict'

var Product = require('../model/product.model');
var Category = require('../model/category.model');

function createProduct(req,res){
    var iduser = req.params.id;
    var body = req.body;
    var product = new Product();

    if(req.user.role == "ADMIN"){
        if(body.name && body.quantity && body.category && body.price && body.category){
            Category.findOne({name:body.category},(err,categoryfind)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor", err});
                }else if(categoryfind){
                    Product.findOne({name:body.name}, (err, productrepeat)=>{
                        if(err){
                            res.status(500).send({message:"Error general del servidor", err});
                        }else if(productrepeat){
                            res.status(404).send({message:"Este producto ya existe en la base de datos"});
                        }else{  
                            product.name = body.name;
                            product.quantity = body.quantity;
                            product.price = body.price;
                            product.sales = 0;
                            product.save((err,productSave)=>{
                                if(err){
                                    res.status(500).send({message:"Error general del servidor", err});
                                }else if(productSave){
                                    Category.findByIdAndUpdate(categoryfind._id,{$push:{products:productSave}},(err,categoryupdate)=>{
                                        if(err){
                                            res.status(500).send({message:"Error general del servidor", err});
                                        }else if(categoryupdate){
                                            res.send({message: productSave});
                                        }else{
                                            res.status(404).send({message:"No se encontro el usuario al que decea actualizar"});
                                        }
                                    });
                                }else{
                                    res.status(400).send({message:"No se pudo crear el producto"});
                                }       
                            });
                        }
                    });
                }else{
                    res.status(404).send({message:"No existe la categoria que ingreso, por favor ingrese una correcta"});
                }
            });  
        }else{
            res.status({message: "Ingrese todos los campos"})
        }   
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function updateProduct(req,res){
    var idProduct = req.params.id;
    var idUser = req.params.idU;
    var body = req.body;

    if(req.user.role == "ADMIN"){
        Product.findOne({name:body.name}, (err, productrepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(productrepeat){
                res.status(404).send({message:"Este producto ya existe en la base de datos"});
            }else{
                Product.findByIdAndUpdate(idProduct,body,{new:true},(err,productupdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(productupdate){
                        res.send({message:productupdate});
                    }else{
                        res.status(404).send({message:"No se encontro el producto al que decea actualizar"});
                    }
                });
            }
        });   
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    } 
}

function deleteProduct(req,res){
    var idProduct = req.params.id;
    
    if(req.user.role == "ADMIN"){
        Category.findOneAndUpdate({products: idProduct}, {$pull:{products: idProduct}},(err,productdeleted)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(productdeleted){
                Product.findByIdAndRemove(idProduct,(err,deleteproduct)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(deleteproduct){
                        res.send({message:"El producto ha sido eliminado exitosamente"});
                    }else{
                        res.status(404).send({message:"No se ha logrado eliminar el producto"});
                    }
                });
            }else{
                res.status(404).send({message:"No se encontro la categoria del producto que deseaba eliminar"});
            }
        });   
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }    
}

function listProduct(req,res){
    var idUser = req.params.id;

    if(req.user.role == 'USER'){
        Product.find({},(err,listproduct)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(listproduct){
                res.send({message:listproduct});
            }else{
                res.status(400).send({message:"No hay productos "});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function addStock(req,res){
    var idProduct = req.params.id;
    var body = req.body;
    
    if(req.user.role == "ADMIN"){
        Product.findById(idProduct,{quantity:1},(err,productfind)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(productfind){
                console.log(productfind)
                var suma = Number(productfind.quantity) + Number(body.quantity);
                let update = {quantity:suma};
    
                Product.findByIdAndUpdate(idProduct,update,{new:true},(err,addproduct)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(addproduct){
                        res.send({producto_Actualizado: addproduct});
                    }else{
                        res.status(404).send({message:"No se logro agregar la cantidad al producto que decea actualizar"});
                    }
                })
            }else{
                res.status(404).send({message:"No se encontro el producto al que desea modificar"});
            }
        });   
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function searchProduct(req,res){
    var body = req.body;
    
    if(req.user.sub == "USER"){
        Product.find({$or:[{name: {$regex: body.search,$options: 'i'}}]},{_id:0},(err,product)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(product){
                if(product == ""){
                    res.status(404).send({message:"No existe ningun producto con este nombre en la base de datos"});
                }else{
                    res.send({Producto: product});
                }
            }else{
                res.status(404).send({message:"No existe este producto en la base de datos"});
            }
        })   
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function productAgot(req, res){
    var idUser = req.params.id;

    if(req.user.sub == iduser){
        Product.find({quantity:0},(err,productend)=>{
            if(err){
                res.status(500).send({message:"Error general en el sistema ", err});
            }else if(productend){
                res.send({productend})
            }else{
                res.status(404).send({message:"No existen productos agotados"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function productmaxSales(req, res){
    var iduser = req.params.id;

    if(req.user.role == 'USER' && req.user.sub == iduser){
        Product.find({},null,{sort:{sales:-1}},(err,productend)=>{
            if(err){
                res.status(500).send({message:"Error general en el sistema ", err});
            }else if(productend){
                res.send({productend});
            }else{
                res.status(404).send({message:"No existen productos agotados"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    listProduct,
    searchProduct,
    addStock,
    productAgot,
    productmaxSales
}