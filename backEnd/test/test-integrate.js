const assert = require('assert');
const axios = require('axios');
const expect = require('chai').expect
const url = "http://localhost:3000"

const imei = "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9460"
const iccid = "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9460"
const msisdn = "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9460"
const imeiNotRegistered = "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9461"
const imeiNot64 = "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a946"

var token = null

var request = async (method, url, data, token) => {
  var resp = await axios({
    method: method,
    url: url,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'token': token
    },
    data: data
  })
  return resp.data
}

// ============= Begin of Tests ======================

it('Backend - Function Qualifica - OK - With wright params', async () => {
  try {
    var qualifica = await request('post', url + '/qualificaDispositivo',
      {
        "device": {
          "imei": imei,
          "iccid": iccid,
          "msisdn": msisdn,
          "motive": "1",
          "description": "AA",
          "fiReference": "testandooo",
          "ispb": "001"
        }
      }, token)
    expect(qualifica.message).to.be.equal("SUCESSO");
    expect(qualifica.code).to.be.equal("0");
    expect(qualifica.data).to.have.property("creationDate")
    expect(qualifica.data).to.have.property("motive")
    var code = parseInt(qualifica.data.motive)
    expect(code).to.be.a('number')
  } catch (err) {
    expect(err).to.be.undefined
  }

})

it('Backend - Function Qualifica - Error - Undefined params', async () => {
  try {
    var qualifica = await request('post', url + '/qualificaDispositivo',
      {
        "device": {
          "imei": undefined,
          "iccid": iccid,
          "msisdn": msisdn,
          "motive": "1",
          "fiReference": "testandooo",
          "ispb": "001",
          "description": "roubado"
        }
      }, token)
    expect(qualifica).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.equal('Qualificação :: ERRO :: Dispositivo não inputado completamente')
  }
})

it('Backend - Function Qualifica - Error - Without body', async () => {
  try {
    var qualifica = await request('post', url + '/qualificaDispositivo',
      {}, token)

    expect(qualifica).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.equal('Qualificação :: ERRO :: Objeto não enviado')
  }
})

it('Backend - Function Qualifica - Error - Not SHA256 params', async () => {
  try {
    var qualifica = await request('post', url + '/qualificaDispositivo',
      {
        "device": {
          "imei": imeiNot64,
          "iccid": iccid,
          "msisdn": msisdn,
          "motive": "1",
          "description": "",
          "fiReference": "testandooo",
          "ispb": "001"
        }
      }, token)
    expect(qualifica).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.deep.eql('Qualificação :: ERRO :: imei, iccid ou msisdn não são SHA-256')
  }
})

it('Backend - Function consultaDispositivo - OK - With wright params', async () => {

  var consulta = await request('get', url + `/consultaDispositivo?imei=${imei}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

  expect(consulta.message).to.be.equal("SUCESSO");
  expect(consulta.code).to.be.equal("0");
  expect(consulta.data).to.have.property("creationDate")
  expect(consulta.data).to.have.property("motive")
  var code = parseInt(consulta.data.motive)
  expect(code).to.be.a('number')

})

it('Backend - Function consultaDispositivo - Null - Device not registered', async () => {
  try {
    var consulta = await request('get', url + `/consultaDispositivo?imei=${imeiNotRegistered}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta.message).to.be.equal("No devices found");
    expect(consulta.code).to.be.equal("-99");
  } catch (err) {
    expect(err).to.be.undefined

  }
})

it('Backend - Function consultaDispositivo - Error - Missing params', async () => {
  try {
    var consulta = await request('get', url + `/consultaDispositivo?iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var code = parseInt(consulta.motive)
    // expect(code).to.be.a('number')
  } catch (err) {
    expect(err.response.data).to.be.deep.eql("Consulta Dispositivo :: ERRO :: Dispositivo não inputado completamente")
  }
})

it('Backend - Function consultaDispositivo - Error - Not SHA256 params', async () => {
  try {
    var consulta = await request('get', url + `/consultaDispositivo?imei=${imeiNot64}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var code = parseInt(consulta.motive)
    // expect(code).to.be.a('number')
  } catch (err) {
    expect(err.response.data).to.be.deep.eql("Consulta Dispositivo :: ERRO :: imei, iccid ou msisdn não são SHA-256")
  }
})

it('Backend - Function consultaHistorico - OK - With wright params', async () => {

  var consulta = await request('get', url + `/consultaHistoricoDispositivo?imei=${imei}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

  //console.log(consulta[0].Value)
  expect(consulta.message).to.be.equal("SUCESSO");
  expect(consulta.code).to.be.equal("0");
  expect(consulta.data).to.be.an("array")
  expect(consulta.data[0].Value).to.have.property("deviceID")
  expect(consulta.data[0].Value).to.have.property("motive")
  var code = parseInt(consulta.data[0].Value.motive)
  expect(code).to.be.a('number')

})

it('Backend - Function consultaHistorico - Null - Device not registered', async () => {
  try {
    var consulta = await request('get', url + `/consultaHistoricoDispositivo?imei=${imeiNotRegistered}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta.message).to.be.equal("SUCESSO");
    expect(consulta.code).to.be.equal("0");
    expect(consulta.data).to.be.deep.eql([])
  } catch (err) {
    expect(err).to.be.undefined

  }
})

it('Backend - Function consultaHistorico - Error - Missing params', async () => {
  try {
    var consulta = await request('get', url + `/consultaHistoricoDispositivo?iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var code = parseInt(consulta.motive)
    // expect(code).to.be.a('number')
  } catch (err) {
    expect(err.response.data).to.be.deep.eql("Consulta Historico :: ERRO :: Dispositivo não inputado completamente")
  }
})

it('Backend - Function consultaHistorico - Error - Not SHA256 params', async () => {
  try {
    var consulta = await request('get', url + `/consultaHistoricoDispositivo?imei=${imeiNot64}&&iccid=${iccid}&&msisdn=${msisdn}`, {}, token)

    expect(consulta).to.be.undefined
    // expect(consulta).to.have.property("deviceID")
    // expect(consulta).to.have.property("motive")
    // var code = parseInt(consulta.motive)
    // expect(code).to.be.a('number')
  } catch (err) {
    expect(err.response.data).to.be.deep.eql("Consulta Historico :: ERRO :: imei, iccid ou msisdn não são SHA-256")
  }
})

it('Backend - Function removerDispositivo - OK - With wright params', async () => {

  var remove = await request('post', url + '/removerDispositivo',
    {
      "device": {
        "imei": imei,
        "iccid": iccid,
        "msisdn": msisdn,
        "motive": "1",
        "description": "AA",
        "fiReference": "testandooo",
        "ispb": "001"
      }
    }, token)
  expect(remove.message).to.be.equal("SUCESSO");
  expect(remove.code).to.be.equal("0");

})

it('Backend - Function removerDispositivo - Error - Undefined params', async () => {
  try {
    var remove = await request('post', url + '/removerDispositivo',
      {
        "device": {
          "imei": undefined,
          "iccid": iccid,
          "msisdn": msisdn,
          "motive": "1",
          "fiReference": "testandooo",
          "ispb": "001",
          "description": "roubado"
        }
      }, token)
    expect(remove).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.equal('Remoção :: ERRO :: Dispositivo não inputado completamente')
  }
})

it('Backend - Function removerDispositivo - Error - Without body', async () => {
  try {
    var remove = await request('post', url + '/removerDispositivo',
      {}, token)

    expect(remove).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.equal('Remoção :: ERRO :: Objeto não enviado')
  }
})

it('Backend - Function removerDispositivo - Error - Not SHA256 params', async () => {
  try {
    var remove = await request('post', url + '/removerDispositivo',
      {
        "device": {
          "imei": imeiNot64,
          "iccid": iccid,
          "msisdn": msisdn,
          "motive": "1",
          "description": "",
          "fiReference": "testandooo",
          "ispb": "001"
        }
      }, token)
    expect(remove).to.be.undefined
  }
  catch (err) {
    expect(err.response.data).to.be.deep.eql('Remoção :: ERRO :: imei, iccid ou msisdn não são SHA-256')
  }
})