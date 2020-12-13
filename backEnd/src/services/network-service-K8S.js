/**
 * SERVIÇO DE CONEXÃO COM A REDE BLOCKCHAIN EM KUBERNETS
 * Funções: gerenciador de wallet (criador de identidade), registrador de usuário e conexao por gateway da fabric-network
 */

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
//BUSCAR CONNECTION PROFILE PARA REDE LOCAL
const ccpPath = path.resolve(__dirname, '..', '..', '..', 'gateway', 'connection-K8S.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
var connectionProfile = JSON.parse(ccpJSON);
// const yaml = require('js-yaml');

//criando o file system wallet
const enderecoDaCarteira = path.join(process.env.K8S_URL_FILESYSTEMWALLET, 'wallet');
const carteira = new FileSystemWallet(enderecoDaCarteira);

preparandoServico();

async function preparandoServico(){
    //BUSCANDO O CONNECTION PROFILE NO SWAGGER
    // connectionProfile = await getConnectionProfile();

    //criar identidade do usuario do peer
    await criarIdentidade(process.env.K8S_CA_USER, process.env.K8S_CA_PASSWORD)
    // await criarUsuarioCA("vitor");
}



/**
 * Função para criar um usuario no CA e gerar uma identidade nova na wallet
 * @param {*} usuario 
 */
function criarUsuarioCA(usuario) {
    return new Promise(async (resolve, reject) => {
        
        // Verificando a existencia do usuário
        const usuarioExiste = await carteira.exists(usuario);
        if (usuarioExiste) {
            reject(`Já existe uma wallet para ${usuario} `)
        }

        //Verificando se a respApi tem uma conta ADM
        const adminExiste = await carteira.exists('admin');
        if (!adminExiste) {
            reject('O resp-api precisa de uma wallet de Administrador')
        }

        //Conectando à rede usando o adm
        const gateway = new Gateway();
        console.log("connectando na rede");
        await gateway.connect(connectionProfile, { wallet: carteira, identity: 'admin', discovery: { enabled: false } });
        console.log("buscando ca");
        const ca = gateway.getClient().getCertificateAuthority();
        console.log("buscando identidade:");
        const identidadeAdmin = gateway.getCurrentIdentity();

        //Criando registro do novo usuário
        const segredo = await ca.register({ affiliation: process.env.K8S_MSPID, enrollmentID: usuario, role: 'client'}, identidadeAdmin);
        await criarIdentidade(userName, segredo)
        console.log(segredo)

        resolve("Sucesso")
    })

}


/**
 * Função para criar o adm do peer. Use somente uma vez.
 */
async function criarIdentidade(id, secret){
    return new Promise(async (resolve, reject) => {

        //Conectando ao CA da organizacao
        const ca = new FabricCAServices(process.env.K8S_CA_URL);

        const adminExiste = await carteira.exists(id);
        if (adminExiste) {
             console.log('Uma identidade já existe ');
            await carteira.delete(id);
            console.log("identidade antiga deletada. Gerando uma nova identidade...");
        }
        // Inscreve usuario admin e salva na carteira
        console.log("ENROLL");
        const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: secret });
        console.log("gerando identidade");
        const identidade = X509WalletMixin.createIdentity(process.env.K8S_MSPID, enrollment.certificate, enrollment.key.toBytes());
        console.log("salvando identidade");
        await carteira.import(id, identidade);
        console.log("sucesso!");
        resolve("sucesso");
    })
}

/**
 * Método padrão para submeter transações
 * @param {*} usuario Proprietário da wallet
 */
function getGatewayContract(usuario){
    return new Promise( async (resolve, reject)=>{
          //Abrindo conexao com a network

        const gateway = new Gateway();
        
        try{
            // Configura connectionOptions\
            console.log("preparando opcao de conexao");
            let opcoesDeConexao = {
                // identity: usuario.toLowerCase(),
                identity: usuario,
                wallet: carteira,
                discovery: { enabled:false, asLocalhost: true }
            };


            
            console.log("Conectando");
            await gateway.connect(connectionProfile, opcoesDeConexao);
            const rede = await gateway.getNetwork(process.env.K8S_CHANNEL);
            console.log("geting contract");
            const contrato = await rede.getContract(process.env.K8S_CONTRACTNAME);
            console.log("got contract");
            resolve(contrato)

        }catch(erro){   
            reject(erro)
        }
    })
  

}

async function getConnectionProfile(){

    //preparando url
    var url = process.env.K8S_URL+"/api/v1/networks/"+process.env.K8S_NETWORK_ID+"/connection_profile" 
    console.log("Buscando Connection Profile")
    console.log(url);
    console.log(process.env.K8S_KEY, process.env.K8S_SECRET);
    //Conseguindo connection profile
    await axios({
        method:'get',
        url: url,
        auth: {
            "username": process.env.K8S_KEY,
            "password": process.env.K8S_SECRET
        },
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
    }).then(resp=>{
        //adicionado connection profile na variavel global
        console.log(resp.data)
        return resp.data;
    })


}


module.exports = {
    criarUsuarioCA: criarUsuarioCA,
    getGatewayContract: getGatewayContract,
    criarIdentidade: criarIdentidade
}


