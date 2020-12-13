//Este service gerencia a wallet e a conectividade com a network

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const path = require('path');
// const ccpPath = path.resolve(__dirname, '..', '..', '..', 'gateway', 'connection.json');
// const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
// const ccp = JSON.parse(ccpJSON);

//criando o file system
const enderecoDaCarteira = path.join('wallet');
const carteira = new FileSystemWallet(enderecoDaCarteira);
const yaml = require('js-yaml');


criarIdentidade("admin", "adminpw").then(resp =>{
    getBlocksInfo("admin", 12)
})

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
        await gateway.connect(ccp, { wallet: carteira, identity: 'admin', discovery: { enabled: false } });
        const ca = gateway.getClient().getCertificateAuthority();
        const identidadeAdmin = gateway.getCurrentIdentity();

        var payload = [ {name: "ISPB", value: "237", ecert: true} ]

        //Criando registro do novo usuário
        const segredo = await ca.register({ affiliation: 'org1.department1', enrollmentID: usuario, role: 'client', attrs: payload}, identidadeAdmin);
        await criarIdentidade(userName, segredo)

        resolve("Sucesso")
    })

}


/**
 * Função para criar o adm do peer. Use somente uma vez.
 */
async function criarIdentidade(id, secret){
    return new Promise(async (resolve, reject) => {

        // const caURL = ccp.certificateAuthorities['ca.example.com'].url;
        const ca = new FabricCAServices("http://localhost:7054");

        const adminExiste = await carteira.exists(id);
        if (adminExiste) {
            console.log("Uma identidade admin já existe");
            console.log(" -- Deletando");
            carteira.delete(id)
            console.log("Deletada com SUCESSO");
        }
        
        // Inscreve usuario admin e salva na carteira
        console.log(" -- Gerando nova identidade");
        const enrollment = await ca.enroll({ enrollmentID: id, enrollmentSecret: secret  });
        const identidade = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await carteira.import(id, identidade);
        console.log("Nova identidade gerada com SUCESSO");
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
            
            // Carregando o connectionProfile
            let perfilDeConexao = yaml.safeLoad(path.resolve(__dirname, '..', '..', '..', 'gateway', 'networkConnection.yaml')
            );

            // Configura connectionOptions
            let opcoesDeConexao = {
                identity: usuario.toLowerCase(),
                wallet: carteira,
                discovery: { enabled:false, asLocalhost: true }
            };


            await gateway.connect(perfilDeConexao, opcoesDeConexao);
            const rede = await gateway.getNetwork('mychannel');
            const contrato = await rede.getContract('chaincode');

            resolve(contrato)

        }catch(erro){   
            reject(erro)
        }
    })
  

}


/**
 * Retorna informações do último bloco do canal
 * @param {*} usuario //NOME IDENTIDADE PARA SE CONECTAR A REDE
 */
async function getBlocksInfo(usuario, numberOfBlocks){
    try{
        const gateway = new Gateway();
        let perfilDeConexao = yaml.safeLoad(path.resolve(__dirname, '..', '..', '..', 'gateway', 'networkConnection.yaml'));

        // Configura connectionOptions
        let opcoesDeConexao = {
            identity: usuario.toLowerCase(),
            wallet: carteira,
            discovery: { enabled:false, asLocalhost: true }
        };

        //CONECTANDO A REDE
        await gateway.connect(perfilDeConexao, opcoesDeConexao);
        const rede = await gateway.getNetwork('mychannel');
        const channel = rede.getChannel()
        //BUSCANDO INFORMAÇOES DO CANAL
        var info = await channel.queryInfo()

        // VERIFICA SE EXISTE MENOS BLOCOS DO QUE O NUMERO DE BLOCOS DESEJADO
        // SE SIM, RETORNARÁ TODOS QUE EXISTEM
        if(info.height.low-1 < numberOfBlocks) numberOfBlocks = info.height.low-1  
        
        // MONTA UM ARRAY COM OS ULTIMOS N BLOCOS
        let blocks = []
        for(let i = numberOfBlocks; i > 0; i--){
            let block = await channel.queryBlock(info.height.low - 1 - i)
            blocks.push(block)
        }
        // blocks.forEach((block, i)  => {
        //     console.log("BLOCO", i, block.data.data[0].payload.header.channel_header)
        // })

        //var block = await channel.queryBlock(info.height.low-1)
        // console.log("Exibindo informações das transações do último bloco");
        // block.data.data.forEach(tx=>{
        //     console.log(tx.payload.header.channel_header);
        // })
        return blocks
        
    }catch(error){
        console.log(error);
    }


}

module.exports = {
    criarUsuarioCA: criarUsuarioCA,
    getGatewayContract: getGatewayContract,
    criarIdentidade: criarIdentidade,
    getBlocksInfo: getBlocksInfo
}


