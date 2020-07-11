'use strict'

var Category = require('../model/category.model');

function createCategory(req, res){
    var idUser = req.params.id;
    var body = req.body;
    var category = new Category();

    if(idUser == idUser){
        if(body.name){
            Category.findOne({name: body.name}, (err, productRepeat)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor"});
                }else if(productRepeat){
                    res.status(400).send({message:"Categoria ya existente"});
                }else{
                    category.name = body.name;
                    
                    category.save((err, categorysave)=>{
                        if(err){
                            res.status(500).send({message:"Error general del servidor"});
                        }else if(categorysave){
                            res.send({Categoria_Nueva: categorysave});
                        }else{
                            res.status(400).send({message:"No se pudo registrar la categoria"});
                        }
                    });
                }
            });
        }else{
            res.status(404).send({message:"Ingrese la categoria que decea agregar"});
        }
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function updateCategory(req, res){
    var idCategory = req.params.id;
    var idUser =  req.params.idU;
    var body = req.body;

    if(req.user.sub == idUser){
        Category.findOne({name:body.name},(err, categoryRepeat)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(categoryRepeat){
                res.status(400).send({message:"Categoria ya existente"});
            }else{
                Category.findByIdAndUpdate(idCategory, body, {new:true},(err,categoryupdate)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(categoryupdate){
                        res.send({message:categoryupdate});
                    }else{
                        res.status(404).send({message:"No se logro encontrar la categoria a la cual desea actualizar"});
                    }
                });        
            }
        });
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function deleteCategory(req, res){
    var idCategory = req.params.id;
    var idUser = req.params.idU;
    var newCategory = {name:"Por defecto"};
    var body = req.body;

    if(req.user.sub == idUser){
        Category.findById(idCategory,(err,busquedacategoria)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor", err});
            }else if(busquedacategoria.name == "Por Defecto"){
                console.log(busquedacategoria.name);
                res.send({message:"No puedes eliminar la categoria por defecto"});
            }else if(busquedacategoria){
                Category.findByIdAndRemove(idCategory,(err,deletecategory)=>{
                    if(err){
                        res.status(500).send({message:"Error general del servidor", err});
                    }else if(deletecategory){
                        Category.findOneAndUpdate({name: "Por Defecto"},{$push:{products:busquedacategoria.products}},{new:true},(err,categoryDefect)=>{
                            if(err){
                                res.status(500).send({message:"Error general del servidor", err});
                            }else if(categoryDefect){
                                res.send({message:"Categoria eliminada"});
                            }else{
                                res.status(404).send({message:"No se encontro la categoria por defecto"});
                            }     
                        });
                    }else{
                        res.status(404).send({message:"No se encontro la categoria a la que desea eliminar"});
                    }
                });        
            }else{
                res.status(404).send({message:"No se encontro la categoria a la que desea eliminar"});
            }
        });
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

function listCategorys(req, res){
    var iduser = req.params.id;

    if(req.user.sub = iduser){
        Category.find({},(err, categorys)=>{
            if(err){
                res.status(500).send({message:"Error general del servidor"});
            }else if(categorys){
                res.send({Categorias:categorys});
            }else{
                res.send({message:"No hay categorias"});
            }
        });
    }else{
        res.status(403).send({message:"No tiene permisos para esta ruta"});
    }
}

function CategorysProducts(req, res){
    var body = req.body;
    var iduser = req.params.id;

    if(req.user.sub == iduser){
        if(body.category){
            Category.findOne({name:body.category},{name:1,products:1,_id:0},(err,categoryproducts)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor", err});
                }else if(categoryproducts){
                    res.send({Productos_De_Categorias:categoryproducts});
                }else if(categoryproducts.products == ""){
                    res.send({message:"La categoria " + categoryproducts.products + "no tiene productos en su catologo"});
                }else{
                    res.status(500).send({message:"No se supo que paso"});
                }
            }).populate({path: 'products'});
        }else{
            Category.find({},{name:1,products:1,_id:0},(err,categoryproducts)=>{
                if(err){
                    res.status(500).send({message:"Error general del servidor", err});
                }else if(categoryproducts){
                    res.send({Productos_De_Categorias:categoryproducts});
                }else if(categoryproducts == ""){
                    res.send({message:"No hay categorias"});
                }else{
                    res.status(500).send({message:"No se supo que paso"});
                }
            }).populate({path: 'products'});
        }
    }else{
        res.status(404).send({message:"No tiene permisos para esta ruta"});
    }
}

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    listCategorys,
    CategorysProducts
}