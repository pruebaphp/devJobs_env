import mongoose from "mongoose"
import usuarioSchema from "../models/usuarioModel.js"
import vacanteSchema from "../models/vacanteModel.js"
import {check,validationResult,sanitizeBody} from 'express-validator';
import { response } from "express";
import generarJWT from "../helpers/token.js";
import fs from 'fs';
import tokenUsuario from "../helpers/tokenUser.js";
import emailRegistro from "../middlewares/enviarConfirmacionCorreo.js";
import emailCambioPassword from "../middlewares/enviarCorreoCambioPassword.js";

const Vacante = mongoose.model('vacantes',vacanteSchema);
const Usuario = mongoose.model('Usuarios',usuarioSchema);



const formRegistro = async(request,response)=>{
    response.render('autenticacion/registro',{
        nombrePagina:'Crea tu cuenta en devJobs',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
    })
}

const RegistrarUsuario = async(request,response)=>{

 
    const {nombre,email,password,confirmar} = request.body;

    //Sanitizar entradas

  /*  sanitizeBody('nombre').escape().run(request);
    sanitizeBody('password').escape().run(request);
    sanitizeBody('confirmar').escape().run(request);*/

    //console.log(request.body);
    //validar camposs

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(request);
    await check('email').isEmail().withMessage('Ingrese un email correcto').run(request);
    await check('password').isLength({min:7}).withMessage('El password debe tener al menos 7 caracteres').run(request);
    await check('confirmar').equals(request.body.password).withMessage('Los passwords deben ser iguales').run(request);

    const resultado = validationResult(request);

    if(!resultado.isEmpty()){
      return response.render('autenticacion/registro',{
        nombrePagina:'Crea tu cuenta en devJobs',
        tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
        errores: resultado.array(),
        datos:request.body,
       })
    }

    //validar si existe el usuario
    const usuarioBuscar = await Usuario.findOne({email});
    //console.log(usuarioBuscar);

    if(usuarioBuscar){
        return response.render('autenticacion/registro',{
            nombrePagina:'Crea tu cuenta en devJobs',
            tagline:'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            errores: [{msg:'El correo ya está en uso. Prueba con otro'}],
            datos:request.body,
           })
    }


    const usuario = new Usuario();

    usuario.email = email;
    usuario.nombre = nombre;
    usuario.password = password;
    usuario.imagen = '';

    console.log(usuario);

    emailRegistro(usuario);


     await usuario.save();

    response.send('Se envio un correo electronico de confirmacion a la cuenta: '+usuario.email);
}


const formularioLogin = async(request,response)=>{


    response.render('autenticacion/login',{
        nombrePagina:'Iniciar Sesión devJobs',
        tagline:'',
    })
}

const autenticarUsuario = async(request,response)=>{
    //validar email
    const {email,password} = request.body;

    await check('email').isEmail().withMessage('Ingrese un email correcto').run(request);
    await check('password').notEmpty().withMessage('Ingrese un password').run(request);

    const resultado = validationResult(request);

    //si hay errores en los cmapos

    if(!resultado.isEmpty()){
       return response.render('autenticacion/login',{
            nombrePagina:'Iniciar Sesión devJobs',
            tagline:'',
            errores: resultado.array(),
            data: request.body,
        })
    }

    //si paso las validaciones, consultar a la bd

    const usuario = await Usuario.findOne({email})

  //  console.log(usuario)

    if(!usuario){
        return response.render('autenticacion/login',{
            nombrePagina:'Iniciar Sesión devJobs',
            tagline:'',
            errores: [{msg:'Credenciales incorrectas'}],
            data: request.body,
        })
    }

    //si existe el email, verificar el password
    //si la contraseña no coincide
    if(!usuario.compararPasswords(password)){
        return response.render('autenticacion/login',{
            nombrePagina:'Iniciar Sesión devJobs',
            tagline:'',
            errores: [{msg:'Credenciales incorrectas'}],
            data: request.body,
        })
    }

    //validar si su estado es false
    if(!usuario.confirmado){
        return response.render('autenticacion/login',{
            nombrePagina:'Iniciar Sesión devJobs',
            tagline:'',
            errores: [{msg:'Cuenta inactiva, debes confirmar tu correo.'}],
            data: request.body,
        })
    }

    //si la contraseña coincide

    response.cookie('_jwt',generarJWT(usuario._id,usuario.nombre)).redirect('/administracion');

}

const mostrarPanel = async(request,response)=>{

    //consultar el usuario autenticado
    const vacantes = await Vacante.find({autor:request.usuario._id});

   // console.log(vacantes);

    response.render('administracion',{
        nombrePagina:'Panel de Administración',
        tagline: 'Crea y Administra tus vacantes desde aquí',
        vacantes,
        cerrarSesion:true,
        imagen: request.usuario.imagen,
        nombre:request.usuario.nombre,
    });
}

const formEditarPerfil = async(request,response)=>{
    response.render('editar-perfil',{
        nombrePagina: 'Edita tu perfil en devJobs',
        datosUsuario:request.usuario,
        cerrarSesion:true,
        nombre:request.usuario.nombre,
        imagen: request.usuario.imagen,
    })
}

const editarPerfil = async(request,response)=>{
    const {nombre,password} = request.body;

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(request);
    
    const resultado = validationResult(request);

  //  console.log(request.file);
   // return; 

   /* if(!request.file){
        //if(request.file.mimetype!==("image/jpeg" || "image/png")){
            resultado.errors.push({msg:'Ingrese un formato válido, png ó jpeg'})
       // }
    }*/

    if(request.file){
        console.log(request.file);
        console.log(request.file.mimetype);
        console.log(`${request.file.mimetype}!=image/jpeg || ${request.file.mimetype}!=image/png`)
        if(request.file.mimetype=='image/jpeg' || request.file.mimetype=='image/png'){

        }else{
        //if(request.file.mimetype!=('image/jpeg' || 'image/png')){
            resultado.errors.push({msg:'Ingrese un formato válido, png ó jpeg'})

            console.log('F OR MA TO IN C O R R  E C TO');
                try {
                    //resultado.errors.push({msg:'Ingrese un formato válido, png ó jpeg'})
                    fs.unlinkSync(`public/uploads/perfiles/${request.file.filename}`)
                    console.log('Se eliminó el archivo por invalido: '+request.file.filename)
                } catch (error) {
                    console.log(error);
                }   
        }
    }

   // console.log(resultado.errors.push({msg:'quee'}));
        

    if(!resultado.isEmpty()){
       return response.render('editar-perfil',{
            nombrePagina: 'Edita tu perfil en devJobs',
            datosUsuario:request.body,
            errores: resultado.array(),
            cerrarSesion:true,
            imagen: request.usuario.imagen,
        })
    }
    
    //si el password está vacio, no actualizar
    const usuario = await Usuario.findById(request.usuario._id);
    if(usuario.imagen && request.file){
        try {
            fs.unlinkSync(`public/uploads/perfiles/${usuario.imagen}`)
            console.log(`Se eliminó la imagen de perfil ${usuario.imagen}`);
        } catch (error) {
            console.log(error)
        }
      
    }


    usuario.nombre = nombre;
    if(password){
        usuario.password = password;
    }
    if(request.file){
        usuario.imagen = request.file.filename;
    }

   // console.log(usuario);

    await usuario.save();

    response.redirect('/administracion');

}

const cerrarSesion = async(request,response)=>{
    await response.clearCookie('_jwt').redirect('/login');
}

const formResetPassword = async(request,response)=>{
    response.render('autenticacion/reset-password',{
        nombrePagina: 'Reestablece tu password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email',
    })
}

const resetearPassword = async(request,response)=>{

    await check('email').isEmail().withMessage('Ingrese un email correcto').run(request);
    
    const resultado = validationResult(request);

    if(!resultado.isEmpty()){
        return response.render('autenticacion/reset-password',{
            nombrePagina: 'Reestablece tu password',
            tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email',
            errores:resultado.errors,
            data: request.body,
        })
    }

    const usuario = await Usuario.findOne({email:request.body.email})

    if(!usuario){
        return response.render('autenticacion/reset-password',{
            nombrePagina: 'Reestablece tu password',
            tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email',
            errores:[{msg:'El usuario ingresado no existe'}],
            data: request.body,
        })
    }

    //si el usuario aun no ha confimado su cuenta

    if(!usuario.confirmado){
        return response.render('autenticacion/reset-password',{
            nombrePagina: 'Reestablece tu password',
            tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email',
            errores:[{msg:'El usuario aún no ha verificado su cuenta.'}],
            data: request.body,
        })
    }

    //si todo esta bien

    const tokenUser = tokenUsuario();

    usuario.token = tokenUser;
    //esto hace que el token expire en 1 hora
    usuario.expira = Date.now()+3600000;

    //const urlReset = `http://${request.headers.host}/reestablecer-password/${tokenUser}`;

    //console.log(usuario);

    //console.log(urlReset);
    await usuario.save();

    emailCambioPassword(usuario);

    response.send('Se envio un correo para cambiar el password a : '+usuario.email);

 /*   response.render('templates/mensaje',{

    })*/
}

const formConfirmarCuenta = async(request,response)=>{
    const {token} = request.params;

    const usuario = await Usuario.findOne({token});

    if(!usuario){
        return response.redirect('/login');
    }

    //si existe el usuario
    usuario.token = '';
    usuario.confirmado = true;

    await usuario.save();

    response.send('Cuenta confirmada correctamente');
    
}

const formCambiarPassword = async(request,response)=>{

    const {token} = request.params;

    const usuario = await Usuario.findOne({token});

    if(!usuario){
        return response.redirect('/login');
    }

    if(usuario.expira < Date.now()){
        return response.redirect('/login');
    }

    //si existe el usuario

    response.render('autenticacion/cambiar-password',{
        nombrePagina: 'Cambia tu password',
        tagline: 'Desde este formulario, podras cambiar tu password a uno nuevo.',

    })
}

const cambiarPassword = async(request,response)=>{
    const {token} = request.params;

    const usuario = await Usuario.findOne({token});

    if(!usuario){
        return response.redirect('/login');
    }

    if(usuario.expira < Date.now()){
        return response.redirect('/login');
    }

    //validar campos

    await check('password').isLength({min:7}).withMessage('El nuevo password debe tener almenos 7 caracteres.').run(request);
    await check('confirmar').equals(request.body.password).withMessage('Los passwords deben ser iguales').run(request);

    const resultado = validationResult(request);


    if(!resultado.isEmpty()){
        return response.render('autenticacion/cambiar-password',{
            nombrePagina: 'Cambia tu password',
            tagline: 'Desde este formulario, podras cambiar tu password a uno nuevo.',
            errores:resultado.array(),
            datos: request.body,
        })
    }


    //si no hay errores

    usuario.password = request.body.password;
    usuario.token = '';
    usuario.expira = '';

    await usuario.save();

    response.send('Contraseña cambiada satisfactoriamenteee');

    
}


export{
    formRegistro,
    RegistrarUsuario,
    formularioLogin,
    autenticarUsuario,
    mostrarPanel,
    formEditarPerfil,
    editarPerfil,
    cerrarSesion,
    formResetPassword,
    resetearPassword,
    formConfirmarCuenta,
    formCambiarPassword,
    cambiarPassword,
}