const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ipcontrol', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Banco de dados IPControl criado com sucesso!');
        // Adicione lógica para popular dados iniciais se necessário
        mongoose.connection.close();
    })
    .catch(err => console.log(err));
