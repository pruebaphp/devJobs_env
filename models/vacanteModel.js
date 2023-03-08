import mongoose from "mongoose";
import shortid from "shortid";
import slug from "slug";

const vacanteSchema = new mongoose.Schema({
    titulo:{
        type: String,
        required: 'El nombre de la vacante es obligatorio.',
        trim: true,
    },

    empresa:{
        type:String,
        trim:true,
        required:'La empresa es obligatoria'

    },

    ubicacion:{
        type:String,
        trim:true,
        required:'La ubicación es obligatoria'
    },

    salario:{
        type:String,
        default:0,
        trim:true,
        required:'El salario es obligatorio'
    },

    contrato:{
        type: String,
        trim:true,
    },

    descripcion:{
        type: String,
        trim:true,
        required: 'La descripción es obligatoria',
    },

    url:{
        type: String,
        lowercase:true,
    },
    //las skills son lo que el programador debe saber
    skills: [String],
    //estos seran los candidatos que se van apuntando al puesto de trabajo y se ira llenando este arreglo de objetos
    candidatos: [{
        nombre: String,
        email: String,
        cv: String,
    }],

    autor:{
        type: mongoose.Schema.ObjectId,
        ref:'usuarios',
        required: 'El autor es obligatorio',
    }


});
//Esto está en Middleware
vacanteSchema.pre('save',function(next){
    //crear la url

    const url = slug(this.titulo); //resultado = React Developer  = react-developer
    this.url = `${url}-${shortid.generate()}`//resultado == react-developer-15592665

    next();
})

//CREAR UN INDICE

vacanteSchema.index({titulo:'text'});

//export default mongoose.model('Vacante',vacanteSchema)
export default vacanteSchema

