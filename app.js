/* **********FICHIER app.js CONTIENT NOTRE APPLICATION********** */

//* *****Import des packages***** *//

// Importation du Framework Express
const express = require('express');

// Importation du package mongoose pour se connecter à la data base mongo Db
const mongoose = require('mongoose');

// Importation du package helmet qui va servir à sécurisé notre application 
const helmet = require('helmet');

// Importation du package body-parser qui permet d'extraire l'objet JSON des requêtes POST
const bodyParser = require('body-parser');

// Importation du package qui sert dans l'upload des images et permet de travailler avec les répertoires et chemin de fichier
const path = require('path');

// On demande d'appliquer le package dotenv pour sécurisé des données sensible
require('dotenv').config();


//* *****Déclaration des routes***** *//

// On importe la route dédiée aux utilisateurs
const userRoutes = require('./routes/user');

// On importe la route dédiée aux sauces
const saucesRoutes = require('./routes/sauces');


//* *****Connection à la base de données mongoDB***** *//

// Sécurité du login et du mot de passe de mongoose
const urlDb = 'mongodb+srv://' + process.env.USER_DB + ":" +process.env.PASSWORD_DB + '@' + process.env.URL_DB + '/' + process.env.NAME_DB + '?retryWrites=true&w=majority';

mongoose.connect(urlDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true })
    .then (() => console.log ('Connection à MongoDB réussis !') )
    .catch ( 'Connection à MongoDB échouée !')


// Création d'une application express   
const app = express();

// Application du package helmet dans notre application
app.use(helmet());

// Middleware Header qui permet à toutes les demandes de toutes les origines d'accéder à l'API
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// Middleware qui permet de transformer le corp de la requête en un objet JSON utilisable
app.use(bodyParser.json());

// Midleware qui permet de charger les fichiers qui sont dans le repertoire images
app.use('/images', express.static(path.join(__dirname, 'images' )));

// Routes dédiées aux sauces
app.use('/api/sauces', saucesRoutes);

// Routes dédiées aux users
app.use('/api/auth', userRoutes);

// Export de l'application express pour y accéder depuis server.js
module.exports = app;