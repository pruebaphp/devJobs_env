import mongoose from "mongoose";
import bcrypt from 'bcrypt';


const usuarioSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
    },
    nombre:{
        type:String,
        required:'Agrega tu nombre',
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
    token: {
        type:String,
        default: Math.random().toString(32).slice(3)+"-"+Date.now().toString(32)+"-"+Math.random().toString(32).slice(3)
    },

    confirmado:{
        type: Boolean,
        default:0,
    },
    expira: Number,
    imagen: String,
})

usuarioSchema.methods = {
    compararPasswords: function(password){
        return bcrypt.compareSync(password,this.password);
    }
}

//Metodo para hashear passwords
usuarioSchema.pre('save',async function(next){

    //si el password ya está hasheado

    if(!this.isModified('password')){
        return next();
    }
    //si no está hasheado

    const passwordHash = await bcrypt.hash(this.password,10)
    this.password = passwordHash;
    next();
})



export default usuarioSchema;