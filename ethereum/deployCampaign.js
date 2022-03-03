const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledCampaign = require('./build/Campaign.json');
const path = require('path');
require('dotenv').config({path: path.join(__dirname,'..', '.env')});

const phrase = process.env.SECRET_MNEMONIC_PHRASE;
const provider = new HDWalletProvider(
    phrase,
    process.env.INFURA_RINKEBY_URL
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
  
    console.log('Attempting to deploy from account', accounts[0]);
  
    const result = await new web3.eth.Contract(
      compiledCampaign.abi
    )
      .deploy({ data: compiledCampaign.evm.bytecode.object })
      .send({ gas: '1000000', from: accounts[0] });
  
    console.log('Contract deployed to', result.options.address);
    process.exit();
};
  deploy();