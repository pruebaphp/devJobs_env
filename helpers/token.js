import jwt from 'jsonwebtoken';

const generarJWT = (id,nombre)=>{
    return jwt.sign({
        id,
        nombre,
    },process.env.PALABRA_SECRETA, { expiresIn: '1d' })
}

export default generarJWT;