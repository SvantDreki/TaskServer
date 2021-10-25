const Tarea = require('../models/Tarea'); 
const Proyecto = require('../models/Proyecto');
const { validationResult } = require('express-validator');

//Crea una nueva tarea
exports.crearTarea = async (req, res) => {
    //Revisa si hay errores
    const errores = validationResult(req);
    if( !errores.isEmpty() ) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {

        //Extraer el proyecto y ver si existe
        const { proyecto } = req.body;
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        const tarea = new Tarea(req.body);
        await tarea.save();
        res.json({tarea});

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene las tareas
exports.obtenerTareas = async (req, res) => {
    try {
        //Extraer el proyecto y ver si existe
        const { proyecto } = req.query;
        const proyectoActual = await Proyecto.findById(proyecto);
        if(!proyectoActual) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' });
        }

        //verificar el creador del proyecto
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        const tareas = await Tarea.find({ proyecto });
        res.json({ tareas });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y ver si existe
        const { proyecto, nombre, estado } = req.body;

        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrado' });
        }

        const proyectoActual = await Proyecto.findById(proyecto);
        
        //verificar el creador del proyecto
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        //Crear un objeto con la nueva informacion
        const nuevaTarea = {};
        nuevaTarea.nombre = nombre;
        nuevaTarea.estado = estado;

        //Guardar tarea
        tarea = await Tarea.findOneAndUpdate({ _id: req.params.id }, nuevaTarea, { new: true });
        res.json({ tarea });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.eliminarTarea = async (req, res) => {
    try {
        //Extraer el proyecto y ver si existe
        const { proyecto } = req.query;

        let tarea = await Tarea.findById(req.params.id);
        if(!tarea) {
            return res.status(404).json({ msg: 'Tarea no encontrado' });
        }

        const proyectoActual = await Proyecto.findById(proyecto);
        
        //verificar el creador del proyecto
        if(proyectoActual.creador.toString() !== req.usuario.id) {
            return res.status(401).json({ msg: 'No Autorizado' });
        }

        await Tarea.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: 'Tarea eliminada' });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}