#! /bin/bash

echo "Utilizando o domínio ${1} e a porta ${2}"
sleep 2

echo "Qualificando um teste que deve retornar com sucesso:"
curl -k -X POST \
  https://${1}:${2}/v1/dispositivos_restritos/  \
  -H 'Content-Type: application/json' \
  -H 'X-Assinatura: aaabbbbcccc' \
  -H 'X-Chave-Publica: fac241aacbb3312' \
  -H 'X-Identificador-Org: 0800965' \
  -H 'X-Serial-Number: 23891313' \
  -d '{
        "imei": "10",
        "iccid": "10",
        "msisdn": "10",
        "motivo": "5",
        "numeroReferenciaIF": "xxxxxx",
        "descricao": "Teste com header"
}'

echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
sleep 5

echo "Consultando um dispositivo que deve retornar com sucesso:"
curl -k -X GET \
  "https://${1}:${2}/v1/dispositivos_restritos?imei=10&iccid=10&msisdn=10" \
  -H 'X-Assinatura: aaabbbbcccc' \
  -H 'X-Chave-Publica: fac241aacbb3312' \
  -H 'X-Identificador-Org: 0800965' \
  -H 'X-Serial-Number: 23891313' \

echo ""
echo ""
echo ""
echo ""
echo ""
echo ""
sleep 5

echo "Consultando o histórico de um dispositivo que deve retornar com sucesso:"
curl -k -X GET \
  "https://${1}:${2}/v1/dispositivos_restritos/detalhes?imei=10&iccid=10&msisdn=10" \
  -H 'X-Assinatura: aaabbbbcccc' \
  -H 'X-Chave-Publica: fac241aacbb3312' \
  -H 'X-Identificador-Org: 0800965' \
  -H 'X-Serial-Number: 23891313' \