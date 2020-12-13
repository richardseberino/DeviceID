const assert = require('assert');
const axios = require('axios');
const expect = require('chai').expect
const url = "http://localhost:3000"

const valor = "46375647356435"

var request = async (method, url, data, headerIspb) => {

  var resp = await axios({
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/json',
      "X-Assinatura": "rubrica",
      "X-Serial-Number": "idCertificado",
      "X-Chave-Publica": "76==45-2aaa%1",
      "X-Identificador-Org": headerIspb
    },
    data: data
  })
  return resp.data

}


// ============= Começo dos Testes ======================

it('Backend - Função Qualifica - OK - Tudo certo', async () => {
  try {
    var qualifica = await request('put', url + '/v1/dispositivos_restritos',
      {
        
          "imei": valor,
          "iccid": valor,
          "msisdn": valor,
          "motivo": "1",
          "descricao": "aa",
          "numeroReferenciaIF": "testandooo"
        
      }, "ispb")
    
    expect(qualifica.mensagem).to.be.equal("SUCESSO_TEST_REST-API");
    // expect(qualifica.data).to.have.property("dataCriacao")
    // expect(qualifica).to.have.property("motive")
    // var codigo = parseInt(qualifica.motive)
    // expect(codigo).to.be.a('number')
  } catch (erro) {
    
    // console.log("ERRRO",erro);
    expect(JSON.parse(erro)).to.be.undefined
  }
})
it('Backend - Função Qualifica - Erro - Parâmetro indefinido', async () => {
  try {
    var qualifica = await request('put', url + '/v1/dispositivos_restritos',
      {
        "dispositivo": {
          "imei": undefined,
          "iccid": valor,
          "msisdn": valor,
          "motivo": "1",
          "descricao": "",
          "numeroReferenciaIF": "testandooo"
        }
      }, "ispb")
    expect(qualifica).to.be.undefined
  }
  catch (err) {
    expect(err.response.data.mensagem).to.be.equal('Campos obrigatórios não informados.')
  }
})
it('Backend - Função Qualifica - Erro - Header faltante', async () => {
  try {
    var qualifica = await request('put', url + '/v1/dispositivos_restritos',
      {
        "dispositivo": {
          "imei": valor,
          "iccid": valor,
          "msisdn": valor,
          "motivo": "1",
          "descricao": "",
          "numeroReferenciaIF": "testandooo"
        }
      })
    expect(qualifica).to.be.undefined
  }
  catch (err) {
    expect(err.toString()).to.be.equal('Error: "value" required in setHeader("X-Identificador-Org", value)')
  }
})
it('Backend - Função consultaDispositivo - OK - Tudo ok', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos?imei=${valor}&&iccid=${valor}&&msisdn=${valor}`, {}, "ispb")

    expect(consulta.mensagem).to.be.equal("SUCESSO_TEST_REST-API");
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err).to.be.undefined

  }
})
it('Backend - Função consultaDispositivo - Error - Header faltante', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos?imei=${valor}&&iccid=${valor}&&msisdn=${valor}`, {}, undefined)
 
 
    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err.toString()).to.be.equal('Error: "value" required in setHeader("X-Identificador-Org", value)')
  }
})
it('Backend - Função consultaDispositivo - Erro - Parâmetros faltando', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos?iccid=${valor}&&msisdn=${valor}`, {}, "ispb")

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err.response.data.mensagem).to.be.deep.eql("Requisição mal formada, verifique o corpo do Payload")
  }
})
it('Backend - Função consultaHistorico - OK - Tudo ok', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos/detalhes?imei=${valor}&&iccid=${valor}&&msisdn=${valor}`, {}, "ispb")

    expect(consulta.dado.mensagem).to.be.equal("SUCESSO_TEST_REST-API");
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err).to.be.undefined
  }
})
it('Backend - Função consultaHistorico - Erro - Parâmetros faltando', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos/detalhes?iccid=${valor}&&msisdn=${valor}`, {}, "ispb")

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err.response.data.mensagem).to.be.deep.eql("Requisição mal formada, verifique o corpo do Payload.")
  }
})
it('Backend - Função consultaHistorico - Error - Header faltante', async () => {
  try {
    var consulta = await request('get', url + `/v1/dispositivos_restritos/detalhes?imei=${valor}&&iccid=${valor}&&msisdn=${valor}`, {})

    expect(consulta).to.be.undefined
    // expect(consulta.mensagem).to.be.equal("SUCESSO");
    // expect(consulta.codigo).to.be.equal("0");
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var codigo = parseInt(consulta.motive)
    // expect(codigo).to.be.a('number')
  } catch (err) {
    expect(err.toString()).to.be.equal('Error: "value" required in setHeader("X-Identificador-Org", value)')
  }
})

