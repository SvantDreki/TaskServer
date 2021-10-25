const mongoose = require('mongoose');
require('dotenv').config({ path: 'variables.env' });

const conectarBD = async () => {
    try {
        await mongoose.connect( process.env.DB_MONGO, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } );

        console.log('DB Conectada');
    } catch (error) {
        console.log('Hubo un error');
        console.log(error);

        process.exit();
    }
}

module.exports = conectarBD;