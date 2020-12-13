
"use strict";
var networkService
if (process.env.K8S_USE == "true") networkService = require('./../services/network-service-K8S')
else if (process.env.IBP_USE == "true") networkService = require('./../services/network-service-IBP')
else networkService = require('./../services/network-service')

let nomeDaCarteira = "admin"
/**
 * 
 * @param {JSON} dispositivo 
 */
function qualificaDispositivo(dispositivo) {
    console.log("Vai registrar um novo device");
    return new Promise(async (resolve, reject) => {
        try {
            var resposta

            if (process.env.TEST == "true") {
                resposta = {
                    dado: { mensagem: "SUCESSO_TEST_REST-API" }
                }
                resolve(resposta)
            }
            else {
                var contrato = await networkService.getGatewayContract(nomeDaCarteira)
                console.log("submiting transaction");
                resposta = await contrato.submitTransaction("qualificaDispositivo", dispositivo.imei, dispositivo.iccid,
                    dispositivo.msisdn, dispositivo.motivo, dispositivo.descricao, dispositivo.numeroReferenciaIF,
                    dispositivo.ispb, dispositivo.assinatura, dispositivo.idCertificado, dispositivo.chavePublica)
                console.log(`Método: qualificaDispositivo | ISPB ${dispositivo.ispb} | Resultado ${JSON.parse(resposta).codigo}`);
                resolve(JSON.parse(resposta))
            }
        } catch (erro) {
            reject(erro)
        }
    })
}

/**
 * 
 * @param {string} imei 
 * @param {string} iccid
 * @param {string} msisdn  
 * @param {JSON} authObject 
 */
function consultaDispositivo(imei, iccid, msisdn, authObject) {
    return new Promise(async (resolve, reject) => {

        console.log("Incio da consulta!");
        try {

            let resposta
            let dispositivo
            if (process.env.TEST == "true") {
                resposta = {
                    dado: { mensagem: "SUCESSO_TEST_REST-API" }
                }
                resolve(resposta)
            }
            else {
                var contrato = await networkService.getGatewayContract(nomeDaCarteira);
                dispositivo = await contrato.evaluateTransaction("consultaDispositivo", imei, iccid, msisdn)
                console.log(`Método: consultaDispositivo | idDispositivo: ${imei + iccid + msisdn} | Código de retorno 0`);
                resolve(JSON.parse(dispositivo))
            }
        } catch (erro) {
            console.log(`Método: consultaDispositivo | idDispositivo: ${imei + iccid + msisdn} | Código de retorno 0`);
            reject(erro)
        }
    })
}

/**
 * @param {string} imei 
 * @param {string} iccid
 * @param {string} msisdn  
 * @param {JSON} authObject 
 */
function consultaHistoricoDispositivo(imei, iccid, msisdn, authObject) {
    return new Promise(async (resolve, reject) => {
        try {

            console.log("Inicio da consulta por historico");
            let resposta
            let dispositivo
            if (process.env.TEST == "true") {
                resposta = {
                    dado: { mensagem: "SUCESSO_TEST_REST-API" }
                }
                resolve(resposta)
            }
            else {
                var contrato = await networkService.getGatewayContract(nomeDaCarteira);

                console.log(`Método: consultaHistoricoDispositivo | idDispositivo: ${imei + iccid + msisdn} | Código de retorno 0`);
                dispositivo = await contrato.evaluateTransaction("consultaHistoricoDispositivo", imei, iccid, msisdn)
                resolve(JSON.parse(dispositivo).historico)
            }
        } catch (erro) {
            console.log(`Método: consultaHistoricoDispositivo | idDispositivo: ${imei + iccid + msisdn} | Código de retorno -99`);
            reject(erro)
        }
    })
}

function rastrearUltimosBlocos(){
    return new Promise( async (resolve, reject)=>{
        try{
            var blocks = await networkService.getBlocksInfo();
            resolve(blocks)
        }catch(erro){
            console.log(`Metodo: rastrearUltimosBlocos | ERRO: ${erro}`);
            reject(erro)
        }
    })
}

module.exports = {
    consultaDispositivo: consultaDispositivo,
    qualificaDispositivo: qualificaDispositivo,
    consultaHistoricoDispositivo: consultaHistoricoDispositivo,
    rastrearUltimosBlocos: rastrearUltimosBlocos
}