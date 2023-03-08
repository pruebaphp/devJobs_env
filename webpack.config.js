import path from 'path';

export default {
    mode: 'development',
    entry: {
        bundle: './src/bundle.js',
        registro: './src/registro.js',
        administracion: './src/administracion.js',
    },
    output:{
        path: path.resolve('public/js'),
        filename: '[name].js'
    }
}