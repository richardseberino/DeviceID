const request = require('request')
const crypto = require('crypto');
const fs = require('fs');

const args = require('yargs').option({
    apiUser: {
        alias: 'u'
    },
    apiPassword: {
        alias: 'p'
    },
    apiServer: {
        alias: 's'
    },
    method: {
        alias: 'M'
    },
    imei: {
        alias: 'i'
    },
    iccid: {
        alias: 'c'
    },
    msisdn: {
        alias: 'm'
    },
    certificado: {
        alias: 'cer'
    },
    motivo: {
        alias: 'mot'
    },
    numeroReferenciaIF: {
        alias: 'nroIF'
    },
    descricao: {
        alias: 'desc'
    },
    chave: {
        alias: 'key'
    }
}).argv;

function getToken() {
    return new Promise((resolve, reject) => {

        const options = {
            method: 'POST',
            json: true,
            strictSSL: false,
            agentOptions: {
                rejectUnauthorized: false
            },
            url: `https://${args.apiServer}:9443/api/oauth/token`,
            form: {
                client_id: args.apiUser,
                client_secret: args.apiPassword,
                grant_type: 'client_credentials'
            }
        }

        request(options, (error, result, body) => {
            if (error) {
                console.error(`Error reading token`);
                return reject(error);
            }
            return resolve(body.access_token);
        });
    });
}

function readFile(arquivo) {
    if (!fs.existsSync(arquivo)) {
        throw {
            error: `Não foi possível ler ${arquivo}`
        }
    }
    let retorno = fs.readFileSync(arquivo, 'utf8');
    retorno = retorno.replace(/-----BEGIN CERTIFICATE-----/g, '').replace(/-----END CERTIFICATE-----/g, '').replace(/\r?\n|\r/g, '');
    return retorno;
}

function consultaDispositivo(apiToken, imei, iccid, msisdn, certificado) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            json: true,
            strictSSL: false,
            agentOptions: {
                rejectUnauthorized: false
            },
            url: `https://${args.apiServer}/v1/device_id/dispositivos_restritos?imei=${imei}&iccid=${iccid}&msisdn=${msisdn}`,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'X-Chave-Publica': readFile(certificado),
                'Origin': '*',
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'application/json'
            }
        }
        request(options, (error, result, body) => {
            if (error || (body && body.codigo === 417)) {
                console.error(`Error reading Status`);
                const status = error ? error : body;
                return reject(status);
            }
            return resolve(body);
        });
    });
}

function qualificaDispositivo(apiToken, imei, iccid, msisdn, certificado,chave, motivo, descricao, numeroReferenciaIF) {
    return new Promise((resolve, reject) => {
        const sign = crypto.createSign('sha256WithRSAEncryption');
        sign.write(imei + iccid + msisdn + motivo + descricao + numeroReferenciaIF);
        sign.end();
        const assinatura = sign.sign(fs.readFileSync(chave, 'utf8'), 'base64');

        const options = {
            method: 'PUT',
            json: true,
            strictSSL: false,
            agentOptions: {
                rejectUnauthorized: false
            },
            body: {
                imei,
                iccid,
                msisdn,
                motivo,
                numeroReferenciaIF,
                descricao
            },
            url: `https://${args.apiServer}/v1/device_id/dispositivos_restritos`,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
                'X-Assinatura': assinatura,
                'X-Chave-Publica': readFile(certificado),
                'Origin': '*',
                'Access-Control-Allow-Origin': '*',
                'Content-type': 'application/json'
            }
        }
        request(options, (error, result, body) => {
            if (error || result.statusCode >= 300) 
            {
                console.error(`Erro na qualificação`);
                const status = error ? error : body;
                return reject(status);
            }
            return resolve(body);
        });
    });
}

async function main(args) {
    try {

        //  console.log(args);
        const apiToken = await getToken();
        args.imei = typeof args.imei === 'string'? args.imei:JSON.stringify(args.imei);
        args.iccid = typeof args.iccid === 'string'? args.iccid:JSON.stringify(args.iccid);
        args.msisdn = typeof args.msisdn === 'string'? args.msisdn:JSON.stringify(args.msisdn);
        args.certificado = typeof args.certificado === 'string'? args.certificado:JSON.stringify(args.certificado);
        args.chave = typeof args.chave === 'string'? args.chave:JSON.stringify(args.chave);
        args.motivo = typeof args.motivo === 'string'? args.motivo:JSON.stringify(args.motivo);
        args.descricao = typeof args.descricao === 'string'? args.descricao:JSON.stringify(args.descricao);
        args.numeroReferenciaIF = typeof args.numeroReferenciaIF === 'string'? args.numeroReferenciaIF:JSON.stringify(args.numeroReferenciaIF);
        let result;
        if (args.method === 'consulta') {
            result = await consultaDispositivo(apiToken, args.imei, args.iccid, args.msisdn, args.certificado);
        }
        if (args.method === 'qualifica') {
            result = await qualificaDispositivo(apiToken, args.imei, args.iccid, args.msisdn, args.certificado, args.chave, args.motivo, args.descricao, args.numeroReferenciaIF);
        }
        if (!result) {
            console.error('Erro executando operação');
        } else {
            console.log(JSON.stringify(result));
        }
    } catch (error) {
        console.error(error)
    }
}

main(args);


