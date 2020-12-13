//@ts-check
'use strict';

const express = require('express');
const controlador = require('../../../services/consultaHistoricoDispositivo-service');

let roteador = express.Router();

roteador.get('/', controlador.get);

module.exports = roteador;