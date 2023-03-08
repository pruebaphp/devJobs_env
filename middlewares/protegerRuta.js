import usuarioSchema from "../models/usuarioModel.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
const Usuario = mongoose.model('usuarios',usuarioSchema);

const protegerRuta = async(request,response,next)=>{
   

    const {_jwt} = request.cookies;
    //si no existe un jwt
    if(!_jwt){
        console.log('No existe jwt');
       return response.redirect('/login');
    }
  //  console.log('Si existe jwt')

        try {
            const decoded = jwt.verify(_jwt,process.env.PALABRA_SECRETA);
            const usuarioObtenido = await Usuario.findOne({_id:decoded.id});

                //console.log("asadadasdas");

            if(!usuarioObtenido){
                    return response.redirect('/login');
                }else{
                    request.usuario = usuarioObtenido;
                    return next();
                }

            
        } catch (error) {
            response.clearCookie("_jwt").redirect('/login');
        }

}

export default protegerRuta;