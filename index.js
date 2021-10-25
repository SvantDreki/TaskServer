const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

require('dotenv').config({path: 'variables.env'});

const app = express();

conectarDB(); 

//Habilitar cors
app.use(cors());

//Habilitar express.json
app.use(express.json({ extended: true }));

const PORT = process.env.PORT || 4000;

//Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

app.listen(PORT, '0.0.0.0', () => {
    console.log('El servidor Esta funcionando');
});