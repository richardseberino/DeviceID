//@ts-check
'use strict';

const express = require('express');
const qualificaDispositivoService = require('../../services/qualificaDispositivo-service');
const consultaDispositivoService = require('../../services/consultaDispositivo-service');

let roteador = express.Router();

roteador.post('/', qualificaDispositivoService.put);

roteador.get('/', consultaDispositivoService.get);

module.exports = roteador;