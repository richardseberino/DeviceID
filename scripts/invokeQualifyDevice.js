var networkService = require('./../backEnd/src/services/network-service-K8S')

start()
//Criando wallets
async function start(){
    try{
       var contract = await networkService.getGatewayContract("itau")
       console.log(
           JSON.parse(await contract.submitTransaction("qualificaDispositivo", "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468", "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468",
                "ed30d41195761412edf99efc30bf9ed508c9b8a6c13eb2986d4bb9994d5a9468", "1", "PROBLEMAS", "1241254")))
        console.log("oi")
        return
    }catch(error){
       
    }
    
}