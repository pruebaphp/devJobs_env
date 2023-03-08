//import mongoose from 'mongoose';
//const Vacante = mongoose.model('Vacante')
import {skills} from '../helpers/handlebars.js';
import mongoose from "mongoose";
import vacanteSchema from "../models/vacanteModel.js";
import {check,validationResult} from 'express-validator'
import fs from 'fs';
const Vacante = mongoose.model('vacantes',vacanteSchema)

const formularioNuevaVacante = async(request,response)=>{
    const {_id} = request.usuario;

    //console.log(_id);
    
    response.render('nueva-vacante',{
        nombrePagina: 'Nueva Vacante',
        tagline:'Llena el formulario y publica tu vacante',
        skills,
        imagen:  request.usuario.imagen,
        cerrarSesion:true,
        nombre:request.usuario.nombre,
        
    });
}

const agregarVacante = async(request,response)=>{
    const vacante = new Vacante(request.body);


    //obteniendo el id del usuario que lo publicó
    const {_id} = request.usuario;

    console.log(_id);

    vacante.autor = _id;

    console.log(vacante.skills);
    
    vacante.skills = request.body.skills.split(',');

   // console.log(vacante);
   //console.log(vacante.skills);

    //almacenarlo en la base de datos
    const nuevaVacante = await vacante.save();



    //redireccionar
    response.redirect(`/vacantes/${nuevaVacante.url}`)
    
}

const mostrarVacante = async(request,response)=>{

    const {url} = request.params;
    //con el .populate se puede hacer la relacion de 2 tablas en mongoo
    const vacante = await Vacante.findOne({url}).lean().populate('autor');

    //if((vacante.autor._id).equals(request.))

   // console.log(vacante);

    if(!vacante){
        return response.redirect('/');
    }

   
    

    response.render('vacante',{
        vacante,
        nombrePagina: vacante.titulo,
        barra:true,
    })

}

const formEditarVacante = async(request,response)=>{
    const vacante = await Vacante.findOne({url:request.params.url}).lean();


    if(!vacante){
        return response.redirect('/administracion');
    }   
   // console.log(typeof vacante.autor);
   // console.log(typeof request.usuario._id);
    console.log(`${vacante.autor} es distinto a ${request.usuario._id} ??`);

    if(!vacante.autor.equals(request.usuario._id)){
        console.log('No soniguales')
        return response.redirect('/administracion');
    }

    //console.log(vacante.skills);


    response.render('editar-vacante',{
        vacante,
        skills,
        skillsDeVacante:vacante.skills,
        nombrePagina: `Editar-${vacante.titulo}`,
        imagen: request.usuario.imagen,
        cerrarSesion:true,
        nombre:request.usuario.nombre,
    })


}

const editarVacante = async(request,response)=>{
    const {url} = request.params;

    console.log(typeof url);

    const vacanteActualizada = request.body;

    vacanteActualizada.skills = request.body.skills.split(',')

    console.log(vacanteActualizada);

    const vacante = await Vacante.findOneAndUpdate({url:url},vacanteActualizada,{
        new:true, //esto para que obtenga la vacante pero con los cambios actualizados
        runValidators:true
    })

    response.redirect(`/vacantes/${vacante.url}`);

    
}

const eliminarVacante= async(request,response)=>{
    const {id} = request.params;

    const vacante = await Vacante.findById(id);

    //console.log(vacante);

    console.log(`${vacante.autor}==${request.usuario._id}`)

    if(vacante.autor.equals(request.usuario._id)){
        response.status(200).send('Vacante Eliminada Correctamente');
        vacante.remove();
    }else{
        response.status(403).send('Error');
    }
    
    


}

const contactarVacante = async(request,response)=>{

    const {url} = request.params;
    //con el .populate se puede hacer la relacion de 2 tablas en mongoo
    const vacante = await Vacante.findOne({url}).lean().populate('autor');

   // console.log(vacante);
	
    if(!vacante){
        return response.redirect('/');
    }

    await check('nombre').notEmpty().withMessage('El nombre es obligatorio.').run(request);
    await check('email').isEmail().withMessage('Ingresa un email correcto.').run(request);

    const resultado = validationResult(request);

    if(!request.file){
            resultado.errors.push({msg:'Subir el CV es obligatorio.'});
    }else{
        
        if(request.file.mimetype=="application/pdf"){

        }else{
            fs.unlinkSync(`public/uploads/cv/${request.file.filename}`)
            resultado.errors.push({msg:'El archivo seleccionado debe ser formato PDF.'});
        }
    }

    //resultado.errors.forEach(error=>{
    //    console.log(resultado.array());
   // })
    //console.log('//////**************************************//////');

    if(!resultado.isEmpty()){
	   return response.render('vacante',{
            vacante,
            nombrePagina: vacante.titulo,
            barra:true,
            errores: resultado.array(),
            datos: request.body,
        })
    }

    const {nombre,email} = request.body;

    const candidato = {
        nombre,
        email,
        cv: request.file.filename,
    }

    const vacanteSinRelacion = await Vacante.findOne({url});

    vacanteSinRelacion.candidatos.push(candidato);

    console.log(vacanteSinRelacion);

    await vacanteSinRelacion.save();

    response.redirect('/');

}

const mostrarCandidatos = async(request,response)=>{
    const {id} = request.params;
    console.log(id);

    const vacante = await Vacante.findById(id);

    if(!(vacante.autor).equals(request.usuario._id)){
        return response.redirect('/administracion');
    }


    response.render('candidatos',{
        nombrePagina: `Candidatos Vacante - ${vacante.titulo}`,
        cerrarSesion: true,
        nombre: request.usuario.nombre,
        imagen: request.usuario.imagen,
        candidatos: vacante.candidatos,
    })

}

const buscarVacantes = async(request,response)=>{
    const vacantes = await Vacante.find({
        $text: {
            $search : request.body.q,
        }
    });

    response.render('home',{
        nombrePagina: `Resultados para la busqueda: ${request.body.q}`,
        vacantes,
        barra:true,
    })

    //console.log(vacantes);
}

export{
    formularioNuevaVacante,
    agregarVacante,
    mostrarVacante,
    formEditarVacante,
    editarVacante,
    eliminarVacante,
    contactarVacante,
    mostrarCandidatos,
    buscarVacantes,
}