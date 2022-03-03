const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');


var input = {
    language: 'Solidity',
    sources: {
      'Campaign.sol': {
        content: source
      }
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['*']
        }
      }
    }
  };

  fs.ensureDirSync(buildPath);

  solc.loadRemoteVersion('v0.8.11+commit.d7f03943', function(err, solcSnapshot) {
    if (err) {
      reject(false);
    } else {
      const output = JSON.parse(solcSnapshot.compile(JSON.stringify(input)));
      for(let contract in output.contracts['Campaign.sol']) {
          fs.outputJSONSync(
              path.resolve(buildPath, contract + '.json'),
              output.contracts['Campaign.sol'][contract]
          )
      }
    }
  });
