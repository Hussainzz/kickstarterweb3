
# KickStarter Solidity Contract

Allows users to create a unique campaigns and generate funds in ether, every individual who contributes to your campaign becomes and approver. In order to use funds the manager needs to create fund usage request which needs to be approved by the contributors.

# About Contract

I have a base contract called Campaign and Campaign Factory. First when i started with contract i wrote my own contract factory which deploys instances of my existing Campaign Contract which uses lots gas which is was not the right way to do it.

OLD Campaign Factory

    //SPDX-License-Identifier: MIT

    pragma solidity ^0.8.11;

    contract CampaignFactory {

    address[] public deployedCampaigns;

    function createCampaign(uint _minimum) public {
    Campaign newCampaigns = new Campaign(_minimum, msg.sender);
    deployedCampaigns.push(address(newCampaigns));
    }

    function getDeployedCampaigns() public view returns(address[] memory ){
    return deployedCampaigns;
    }

    }

# Improvement

To solve this gas issue for factory campaign i came across openzeppelin clones
https://blog.openzeppelin.com/workshop-recap-cheap-contract-deployment-through-clones/

The Clones library in OpenZeppelin Contracts includes functions to deploy a proxy using either create (traditional deployment) or create2 (salted deterministic deployment). It also includes functions to predict the addresses of clones deployed using the deterministic method. The Clones library has been available since OpenZeppelin Contracts 3.4.


## Usage/Examples

```javascript
npm install
```

# Compile Code And Deploy
in order for campaign factory to work you must compile and deploy the Campaign contract
which will act as template contract for openzeppelines clone to create clone instances of your campaign contract.
```javascript
/ethereum/contract/Campaign.sol

##compile the contract [all the contracts and stored in build]
node compile

node deployCampaign.js

##next deploy the contract factory [before this make sure you add previously deployed 
Campaign Factory address in deployCampaignFactory.js file]

node deployCampaignFactory.js

```

## Demo

<img src="/demo.gif" width="970">




I have improved this contract by implementing the openzeppline clone contracts.

Learnt Kickstarter Contract From  
https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide

