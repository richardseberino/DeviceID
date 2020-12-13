//@ts-check
'use strict';

const express = require('express');
const networkService = require('../../services/network-info')

let roteador = express.Router();

roteador.get('/', networkService.get);

module.exports = roteador;