const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');
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
      compiledFactory.abi
    )
      .deploy({ 
        data: compiledFactory.evm.bytecode.object,
        arguments:['ADD YOU DEPLOYED CAMPAIGN HERE'] // need a previously deployed contract which acts as an template for factor to clone contracts
      })
      .send({ gas: '1000000', from: accounts[0] });
  
    console.log('Contract deployed to', result.options.address);
    process.exit();

  };
  deploy();