import React, { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import {Router} from '../../routes';

const CampaignNew = () => {
  const [minimumContribution, setMinimumContribution] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    if(minimumContribution == '') {
      setErrorMessage("Minimum contribution required");
      return
    };
    setLoading(true);
    setErrorMessage("");
    try{
      const accounts = await web3.eth.getAccounts();
      await factory.methods.createCampaign(minimumContribution, accounts[0]).send({
          from: accounts[0]
      });
      Router.pushRoute('/');

    }catch(e){
      setErrorMessage(e.message);
    }
    setLoading(false);
  };
  return (
    <Layout>
      <h3>Create a Campaign</h3>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Minimum Contribution</label>
          <Input
            label="Wei"
            labelPosition="right"
            value={minimumContribution}
            onChange={(e) => setMinimumContribution(e.target.value)}
          />
        </Form.Field>

        <Message error header="Oops!" content={errorMessage}/>
        <Button primary loading={loading}>Create</Button>
      </Form>
    </Layout>
  );
};

export default CampaignNew;
