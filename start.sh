CONTRACT_NAME="chaincode"
clear
rm -r backEnd/wallet

docker stop $(docker ps -a -q) && docker rm $(docker ps -a -q)


docker rmi $(docker images |grep 'peer0')


cd ./network/basic-network
./start.sh


cd ..
cd ./configuration/cli
docker-compose -f docker-compose.yml up -d cliFabric

sleep 5

SHA256="ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468"

echo "Installing chaincode..."
docker exec cliFabric peer chaincode install -n ${CONTRACT_NAME} -v 0 -p /opt/gopath/src/github.com -l node
echo "Instantiating chaincode..."
docker exec cliFabric peer chaincode instantiate -n ${CONTRACT_NAME} -v 0 -l node -c '{"Args":["initLedger"]}' -C mychannel -P "AND ('Org1MSP.member')"
sleep 10
# echo "Invoking chaincode..."
# #docker exec cliFabric peer chaincode invoke -n ${CONTRACT_NAME} -c `{"Args":["qualificaDispositivo",${SHA256},${SHA256},${SHA256},"3", "Dispositivo furtado / roubado / perdido", "Jailbreak", "ispb"]}` -C mychannel

echo "Invoking chaincode..."
docker exec cliFabric peer chaincode invoke -n chaincode -c '{"Args":["qualificaDispositivo","111", "111", "111", "5", "descri", "num_ref","ispb" , "assinatura", "idcertificado","chave"]}' -C mychannel

# echo "Invoking chaincode..."
docker exec cliFabric peer chaincode invoke -n chaincode -c '{"Args":["qualificaDispositivo","111", "111", "111", "5", "descri", "num_ref","ispb" , "", "","chave"]}' -C mychannel


# echo "Create identities"
# cd ./../../../scripts
# node initCredentials.js

# docker exec cliFabric peer chaincode invoke -n ${CONTRACT_NAME} -c '{"Args":["qualificaDispositivo","ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468", "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468", "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468", "3", "BB", "Jailbreak"]}' -C mychannel
