'use strict';
const httpStatus = require('http-status-codes');

module.exports = (req, res, next) => {
    let cont_erros = 0;
    let listaErros = [];
    const ISPB = req.get('X-Identificador-Org');
    const serialNumber = req.get('X-Serial-Number');
    const chavePublica = req.get('X-Chave-Publica');
    const assinatura = req.get('X-Assinatura');

    if (!ISPB){
        cont_erros++;
        listaErros.push({
            codigo: parseFloat("417."+cont_erros),
            campo: "X-Identificador-Org",
            mensagem: "Não encontrado ID da Organização."
        });
    }
        
    if (!serialNumber){
        cont_erros++;
        listaErros.push({
            codigo: parseFloat("417."+cont_erros),
            campo: "X-Serial-Number",
            mensagem: "Não encontrado Serial Number do certificado."
        });
    }
        
    if (!chavePublica){
        cont_erros++;
        listaErros.push({
            codigo: parseFloat("417."+cont_erros),
            campo: "X-Chave-Publica",
            mensagem: "Não encontrado chave publica do certificado."
        });
    }
        
    if (!assinatura){
        cont_erros++;
        listaErros.push({
            codigo: parseFloat("417."+cont_erros),
            campo: "X-Assinatura",
            mensagem: "Não encontrado assinatura da chamada."
        });
    }
        
    if (listaErros.length){
        return res.status(httpStatus.EXPECTATION_FAILED).send({ 
            codigo:417,
            mensagem: "Headers não informados.",
            erros:listaErros
         });
    }

    return next();
}