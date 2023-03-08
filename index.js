import mongoose from 'mongoose';
import './config/db.js'
import express, { response } from 'express';
import {engine} from 'express-handlebars'
import indexRoutes from './routes/indexRoutes.js'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
//import seleccionarSkills from './helpers/handlebars.js';
import bodyParser from 'body-parser';
import flash from 'connect-flash';

dotenv.config({path:'.env'})

const app = express();




//habilitar handlebars como engine
/*app.engine('handlebars',
    exphbs({
        defaultLayout: 'layout',
    })
);*/
/*app.engine('handlebars',engine({
    defaultLayout: 'layout',
    helpers: seleccionarSkills,
}));*/

app.set('view engine','pug')
app.set('views','./views')

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended:true}))

app.use(express.urlencoded({extended:true}))

//static files
app.use(express.static('public'))

app.use(cookieParser());

app.use('/',indexRoutes)

app.use((req,res,next)=>{
    next(createError(404,'No encontrado'));
})

app.use( (error,req, res,/*!!!!*/next/*!!!*/) => {
    res.locals.mensaje = error.message;
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    res.render('error');
 });

//esto para crear sesiones en la base de datos?
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave:false,//esto lo que hace es no guardar otra vez,
    saveUninitialized:false, //esto lo que hace es si el usuario no hace nada no la guarda
    store: MongoStore.create({mongoUrl: process.env.DATABASE})

}))



const port = process.env.PUERTO;

app.listen(port,()=>{
    console.log('Funcionando en el puerto '+port)
})