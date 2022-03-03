const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
//const web3 = new Web3('http://127.0.0.1:8545');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaign;

beforeEach(async function() {
    accounts = await web3.eth.getAccounts();

    campaign = await new web3.eth.Contract(compiledCampaign.abi).deploy({
        data:compiledCampaign.evm.bytecode.object
    }).send({
        from : accounts[0], 
        gas: '1000000',
    });

    factory = await new web3.eth.Contract(compiledFactory.abi).deploy({
        data:compiledFactory.evm.bytecode.object,
        arguments: [campaign.options.address]
    }).send({
        from : accounts[0], 
        gas: '1000000',
    });

    // const newCampaign = await new web3.eth.Contract(
    //     compiledCampaign.abi,
    //     newCampaignAddress
    // );

    // let minimumContribution = await newCampaign.methods.minimumContribution().call();
    // console.log(minimumContribution)
    // let manager = await newCampaign.methods.manager().call();
    // console.log(manager)
   
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("creates a newClone/Instance of campaign and calls init function to set minimum contribution and manager(owner) as the sender", async () => {
        const clone = await factory.methods.createCampaign(101,  accounts[5]).send({from : accounts[5], gas: '1000000'});
        const newCampaignAddress = clone.events.CampaignCreated.returnValues.newFoundation;
        assert.ok(newCampaignAddress);
    });


    // it("allows people to contribute money and mark them as approvers", async () => {
    //     await campaign.methods.contribute().send({
    //         value: '200',
    //         from : accounts[1]
    //     });

    //     const isApprover = await campaign.methods.approvers(accounts[1]).call();

    //     assert(isApprover);
    // });

    // it("requires a minimum contribution", async () => {
    //     try {
    //         await campaign.methods.contribute().send({
    //             value: '50',
    //             from : accounts[2]
    //         });
    //         assert(false);
    //     } catch (error) {
    //         assert(error);
    //     }
    // });

    // it('allows a manager to make a payment request', async () => {
    //     await campaign.methods.createRequest('Buy Batteries', '100', accounts[1]).send({
    //         from: accounts[0], gas: '1000000'
    //     });

    //     const request = await campaign.methods.requests(0).call();
    //     assert.equal('Buy Batteries', request.description);
    // });

    // it('processes requests', async () => {
    //     await campaign.methods.contribute().send({
    //         from: accounts[0],
    //         value: web3.utils.toWei('10', 'ether')
    //     });

    //     await campaign.methods.createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1]).send({
    //         from: accounts[0], gas: '1000000'
    //     });

    //     await campaign.methods.approveRequest(0).send({
    //         from: accounts[0], gas: '1000000'
    //     });

    //     await campaign.methods.finalizeRequests(0).send({
    //         from: accounts[0], gas: '1000000'
    //     });

    //     let balance = await web3.eth.getBalance(accounts[1]);
    //     balance = web3.utils.fromWei(balance, 'ether');
    //     balance = parseFloat(balance);

    //     console.log(balance);
    //     assert(balance > 104)

    // });


});