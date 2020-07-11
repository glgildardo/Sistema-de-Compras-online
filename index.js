'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;    

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/DBServidorWeb', {useNewUrlParser: true, useUnifiedTopology:true})
    .then(()=>{
        console.log("La conexion a la base de datos ha salido con exito");
        app.listen(port,()=>{
            console.log('El servidor se esta corriendo en el puerto: ',port);   
        })
    })
    .catch(err=>{
        console.log("No se logro conectar a la base de datos");
    })