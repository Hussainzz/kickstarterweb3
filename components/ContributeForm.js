import React,{useState} from 'react'
import { Button, Form, Input, Message } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from '../routes';

const ContributeForm = ({address}) => {
  const [contribution, setContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const onSubmit = async (e) => {
    e.preventDefault();
    if(contribution == "") {
        setErrorMessage("Enter Your Contribution");
        return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
        const campaign = Campaign(address);
        const [account] = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
            from:account,
            value:web3.utils.toWei(contribution, 'ether')
        });
        Router.replaceRoute(`/campaigns/${address}`)
    } catch (error) {
      setErrorMessage(error.message);
    }
    setContribution("");
    setLoading(false);
  }
  return (
    <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
            <label>Amount to contribute</label>
            <Input label="ether" labelPosition="right" value={contribution} onChange={(e) => setContribution(e.target.value)}/>
        </Form.Field>
        <Message error header="Oops!" content={errorMessage}/>
        <Button primary loading={loading}>
            Contribute!
        </Button>
    </Form>
  )
}

export default ContributeForm