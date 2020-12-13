const Client = require('fabric-client')
const { Channel } = require('fabric-client')
const cp = require('./../gateway/connection.json')

async function getBlock(){
    Client.loadFromConfig(cp);

    //const client = new Client()
    
    const channel = new Channel("mychannel", Client)
    
    let x = await channel.getPeers()
    console.log(x)
}

getBlock()

