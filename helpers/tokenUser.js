
const tokenUsuario = ()=>{
    return Math.random().toString(32).slice(2,8)+"-"+Math.random().toString(32).slice(2,8)+"-"+Math.random().toString(32).slice(2,8)+"-"+Math.random().toString(32).slice(2,8);
}

export default tokenUsuario;