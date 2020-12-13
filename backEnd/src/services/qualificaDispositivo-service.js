"use strict";

const controladorAPI = require("./../controllers/api-controler")
const httpStatus = require("http-status-codes")

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports.put = (req, res, next) => {
    try {
        if(!req.body) throw new Error("Body da requisicao não foi definido")
        let dispositivo_restrito = req.body;
        let cont_erros = 0;
        let listaErros = [];

        let ispb =  req.get('X-Identificador-Org');
        dispositivo_restrito['ispb'] = ispb.indexOf('ISPB') > -1 ? ispb.substring(4) : ispb;
        dispositivo_restrito['assinatura'] = req.get('X-Assinatura');
        dispositivo_restrito['idCertificado'] = req.get('X-Serial-Number');
        dispositivo_restrito['chavePublica'] = req.get('X-Chave-Publica');

        if (!dispositivo_restrito.imei) {
            cont_erros++;
            listaErros.push({
                codigo: parseFloat("400."+cont_erros),
                campo: "imei",
                mensagem: "Imei não informado."
            });
        }
        if (!dispositivo_restrito.iccid) {
            cont_erros++;
            listaErros.push({
                codigo: parseFloat("400."+cont_erros),
                campo: "iccid",
                mensagem: "Iccid não informado."
            });
        }
        if (!dispositivo_restrito.msisdn) {
            cont_erros++;
            listaErros.push({
                    codigo: parseFloat("400."+cont_erros),
                    campo: "msisdn",
                    mensagem: "Msisdn não informado."
                });
        }
        if (!dispositivo_restrito.motivo) {
            cont_erros++;
            listaErros.push({
                codigo: parseFloat("400."+cont_erros),
                campo: "motivo",
                mensagem: "Motivo não informado."
            });
        }
        if (listaErros.length) {
            res.status(httpStatus.BAD_REQUEST).send({ 
                codigo:400,
                mensagem: "Campos obrigatórios não informados.",
                erros:listaErros
             });
        }
        if (!dispositivo_restrito.descricao){
            dispositivo_restrito['descricao'] = "";
        } 
        if (!dispositivo_restrito.numeroReferenciaIF){
            dispositivo_restrito['numeroReferenciaIF'] = "";
        } 
        controladorAPI.qualificaDispositivo(dispositivo_restrito).then(resposta => {
            if(resposta.codigo == 0){
                return res.send(httpStatus.CREATED, resposta.dado)
            }else{
                res.status(httpStatus.BAD_REQUEST).send({ 
                    codigo:400,
                    mensagem: resposta.mensagem
                 });
            }
        }).catch(erro => {
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: erro })
        })
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({error: error})
    }
};