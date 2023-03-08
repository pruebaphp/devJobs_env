import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config({path:'.env'})
//esto está en la parte connections
mongoose.connect(process.env.DATABASE);

mongoose.connection.on('error',(error)=>{
    console.log(error);
    console.log('H - U B O - U - N - E - R -R -R - O - R -----------------************************')
})

//importar los modelos

import '../models/vacanteModel.js'
import '../models/usuarioModel.js'