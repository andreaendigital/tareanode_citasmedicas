// Instalo en terminal:
// npm init --yes
// npm install express
// npm i nodemon --D
// npm i chalk@4
// npm i axios
// npm i moment
// npm i uuid
// npm i lodash


//crear un servidor con express
const express = require('express');  //importo
const axios = require('axios'); //importo
const { v4: uuidv4 } = require('uuid'); //importo
const moment = require('moment'); //importo
const chalk = require('chalk') //importo
const _ = require('lodash'); //importo

const app = express(); //instancio express
const PORT = 3000;  //puerto asignado a variable

app.get('/usuarios', async (req, res) => {
    try {
        //leyendo una api con axios
        const response = await axios.get(`https://randomuser.me/api/?results=10`);
        let users = response.data.results;
        // console.log(users); // Verificar la estructura de los datos en la consola

        //ciclo para asignar IDs y timestamps a usuarios
        let listaUsuarios = [];
        users.forEach((user, i) => {
            user.id = uuidv4().slice(0, 6); //cada usuario se le asigna un id unico con paquete UUID
            user.timestamp = moment().format('MMMM Do YYYY, h:mm:ss a'); // cada usuario almacen la fecha de registro en timestamp formatieada con paquete moment
            //  listaUsuarios += `${i + 1}. Nombre: ${user.name.first} - Apellido: ${user.name.last} - ID: ${user.id} - Timestamp: ${user.timestamp}\n`;
            // listaUsuarios += `<li>Nombre: ${user.name.first} - Apellido: ${user.name.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`;
            listaUsuarios.push(user); // Agregar usuario a listaUsuarios
        });

        //agrego un console para verificar el arreglo de objetos que obtengo del api 
        // console.log(users);

        // Separar usuarios por género utilizando lodash
        // const [generoMasculino, generoFemenino] = _.partition(users, { gender: 'male' });

        // Filtrar usuarios por género usando lodash
        const generoMasculino = listaUsuarios.filter(user => user.gender === 'male');
        const generoFemenino = listaUsuarios.filter(user => user.gender === 'female');


        // const listasAgrupadas = {  generoMasculino,  generoFemenino  };

        // Construir HTML para enviar al cliente
        //map() se está utilizando para iterar sobre cada elemento de este arreglo y generar una cadena de HTML para cada usuario masculino, está tomando cada usuario masculino del arreglo 
        // generoMasculino, generando una cadena de HTML para cada uno de ellos y devolviendo un nuevo arreglo con estas cadenas de HTML. Las que se concatenarán 
        //juntas en una sola cadena utilizando .join('') para formar el HTML final que se enviará al cliente como respuesta.  Si saco el .join('') el html incluye una coma entre cada punto de la lista.

        const htmlResponse = `
            <h1>Usuarios Masculinos:</h1>
            <ul>${generoMasculino.map(user => `<li>Nombre: ${user.name.first} - Apellido: ${user.name.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`).join('')}</ul>
            <h1>Usuarios Femeninos:</h1>
            <ul>${generoFemenino.map(user => `<li>Nombre: ${user.name.first} - Apellido: ${user.name.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`).join('')}</ul>
            <h1>Todos los Usuarios:</h1>
            <ul>${listaUsuarios.map(user => `<li>Nombre: ${user.name.first} - Apellido: ${user.name.last} - ID: ${user.id} - Timestamp: ${user.timestamp}</li>`).join('')}</ul>`;


        // Respuesta que se envía
        res.send(htmlResponse);
        //res.send(JSON.stringify(listasAgrupadas)); // Enviar el objeto como una cadena JSON utilizando res.send()

        //respuesta que se muestra en terminal
        console.log(chalk.blue.bgWhite(htmlResponse)); // Imprime en consola con fondo blanco y color de texto azul usando chalk

    }
    catch (error) {
        console.error('Error fetching random user data:', error);
        res.status(500).json({ error: 'Error fetching random user data' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor Express iniciado en el puerto ${PORT}`);
});


