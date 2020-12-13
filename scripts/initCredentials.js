//SCRIPT PARA CRIAÇÃO RAPIDA DE CERTIFICADOS COM ISPB
var networkService = require('./../backEnd/src/services/network-service')

start()
//Criando wallets
async function start(){
    try{
        await networkService.createIdentity("admin", "adminpw")
        await networkService.createCAUser("itau")
    }catch(error){
        console.log(error)
    }
    
}




