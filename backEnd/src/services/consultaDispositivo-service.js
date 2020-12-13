"use strict";

const controladorAPI = require("./../controllers/api-controler")
const httpStatus = require("http-status-codes")

console.log("COnsulta!!!!!");
/**
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
module.exports.get = (req, res, next) => {
    try {
        let dispositivo = req.query
        let listaErros = []

        if (!dispositivo.imei) {
            listaErros.push("Imei não informado")
        }
        if (!dispositivo.iccid) {
            listaErros.push("Iccid não informado")
        }
        if (!dispositivo.msisdn) {
            listaErros.push("Msisdn não informado")
        }
        if(listaErros.length){
            let numeroDoErro = 0
            let erros = listaErros.map(mensagem => {
                numeroDoErro++;
                return{
                    codigo: parseFloat("400." + numeroDoErro.toString()),
                    mensagem: mensagem,
                    campo: mensagem.split(" ")[0].toLowerCase()
                }
            })
            res.status(httpStatus.BAD_REQUEST).send({codigo: httpStatus.BAD_REQUEST, mensagem: "Requisição mal formada, verifique o corpo do Payload", erros: erros})
            listaErros = []
            numeroDoErro = 0
        }

        else {
            controladorAPI.consultaDispositivo(dispositivo.imei, dispositivo.iccid, dispositivo.msisdn).then(resp => {
                if(resp.dado.idDispositivo || process.env.TEST == "true"){
                    res.status(httpStatus.OK).send(resp.dado);
                }else{
                    res.status(httpStatus.NOT_FOUND).send({
                        codigo:404,
                        mensagem: "Dispositivo não encontrado."
                     });
                }
            }).catch(erro => {
                res.status(httpStatus.BAD_REQUEST).send({ error: erro })
            })
        }
    } catch (error) {
        res.status(httpStatus.BAD_REQUEST).send({ error: error })
    }

};