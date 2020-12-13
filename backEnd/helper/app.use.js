'use strict';

const bodyParser = require('body-parser');
const helmet = require('helmet')
var cors = require('cors');
const CIPValidaHeader = require('../src/middlewares/CIPValidaHeader');
const auth = (req, res, next) => {
    req['authObject'] = {
        username: 'admin',
        org: 'admin',
        nomeDaCarteira: 'admin'
    }
    next()
};

module.exports = (app) => {
    app.use(bodyParser.json({
        limit: '50mb'
    }));
    app.use(cors());
    app.use(auth);
    app.use(helmet())
    app.use(CIPValidaHeader);
    app.use(function (err, req, res, next) {
        if(err.message.indexOf("JSON")){
            res.status(400).json({codigo:400, mensagem: "Conteúdo do payload mal formado."});
        }
        next();
    });
    
    return app;
}