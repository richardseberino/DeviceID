"use strict";

const controladorAPI = require("./../controllers/api-controler")
const httpStatus = require("http-status-codes")
let listaErros = []
let countErros = 1

/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports.get = (req, res, next) => {
    try {
        //usando autenticacao do token
        let dispositivo = req.query

        if (!dispositivo.imei) {
            listaErros.push({
                codigo : parseFloat("400." + countErros),
                campo: "imei",
                mensagem: "Imei não informado"
            });
            countErros++;
        }
        if (!dispositivo.iccid) {
            listaErros.push({
                codigo : parseFloat("400." + countErros),
                campo: "iccid",
                mensagem: "Iccid não informado"
            });
            countErros++;
        }
        if (!dispositivo.msisdn) {
            var obj = {
                codigo : parseFloat("400." + countErros),
                campo: "msisdn",
                mensagem: "Msisdn não informado"
            }
            listaErros.push(obj)
            countErros++;
        }
        if (listaErros.length) {
            
            res.status(400).send({ codigo: 400, mensagem: "Requisição mal formada, verifique o corpo do Payload.",
                                    erros: listaErros })
            listaErros = []
            countErros = 1;

        }
        else {

            controladorAPI.consultaHistoricoDispositivo(dispositivo.imei, dispositivo.iccid, dispositivo.msisdn).then(resp => {
                if(resp.length > 0 || process.env.TEST == "true"){
                    res.status(httpStatus.OK).send(resp);
                }else{
                    res.status(httpStatus.NOT_FOUND).send({
                        codigo:404,
                        mensagem: "Dispositivo não encontrado."
                     });
                }
            }).catch(erro => {
                res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: erro })
            })
        }
    } catch (error) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ error: error })
    }
};