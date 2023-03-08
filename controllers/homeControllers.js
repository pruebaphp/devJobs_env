import mongoose from "mongoose"
import vacanteSchema from "../models/vacanteModel.js"
const Vacante = mongoose.model('vacantes',vacanteSchema);

const mostrarTrabajos = async(request,response)=>{
    //los metodos para traer datos, lo puedes encontrar en la seccion queries
     

    const vacantes = await Vacante.find().lean();


    response.render('home',{
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica trabajos para Desarrolladores Web',
        barra:true,
        boton:true,
        vacantes,
    })
}

export{
    mostrarTrabajos,
}