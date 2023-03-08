import express from 'express';
import { mostrarTrabajos } from '../controllers/homeControllers.js';
import {formularioNuevaVacante,agregarVacante,mostrarVacante,contactarVacante,formEditarVacante,editarVacante,eliminarVacante,mostrarCandidatos,buscarVacantes} from '../controllers/vacanteController.js';
import { formRegistro,RegistrarUsuario,formConfirmarCuenta,formularioLogin,autenticarUsuario,mostrarPanel,formEditarPerfil,editarPerfil,cerrarSesion,formResetPassword,resetearPassword,formCambiarPassword,cambiarPassword } from '../controllers/usuarioController.js';
import protegerRuta from "../middlewares/protegerRuta.js";
import upload from '../middlewares/habilitarSubidaImagen.js';
import uploadcv from '../middlewares/habilitarSubidaCV.js';

const router = express.Router();

router.get('/', mostrarTrabajos)

//crear Vacantes

router.get('/vacantes/nueva',protegerRuta,formularioNuevaVacante);
router.post('/vacantes/nueva',protegerRuta,agregarVacante);

//mostrar vacantes

router.get('/vacantes/:url',mostrarVacante);
router.post('/vacantes/:url',uploadcv.single('cv'),contactarVacante);

//editar vacante

router.get('/vacantes/editar/:url',protegerRuta,formEditarVacante)
router.post('/vacantes/editar/:url',protegerRuta,editarVacante)


//crear Cuentas
router.get('/registro',formRegistro)
router.post('/registro',RegistrarUsuario)

//confirmar cuenta

router.get('/confirmar-cuenta/:token',formConfirmarCuenta);

//resetear password
router.get('/reset-password',formResetPassword);
router.post('/reset-password',resetearPassword);

//cambiar el password

router.get('/cambiar-password/:token',formCambiarPassword);
router.post('/cambiar-password/:token',cambiarPassword);

//iniciar sesion
router.get('/login',formularioLogin)
router.post('/login',autenticarUsuario)

//panel de administración

router.get('/administracion',protegerRuta,mostrarPanel);

//editar perfil

router.get('/editar-perfil',protegerRuta,formEditarPerfil);
router.post('/editar-perfil',protegerRuta,upload.single('imagen'),editarPerfil);

//Eliminar vacantes

router.delete('/vacantes/eliminar/:id',protegerRuta,eliminarVacante);

//cerrar sesion

router.get('/cerrar-sesion',cerrarSesion);

//muestra los candidatos por vacante

router.get('/candidatos/:id',protegerRuta,mostrarCandidatos);

//buscador de vacantes

router.post('/buscador',buscarVacantes);




export default router