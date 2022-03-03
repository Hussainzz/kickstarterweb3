import React, { useState } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Campaign from "../../../ethereum/campaign";
import web3 from "../../../ethereum/web3";
import { Router, Link } from "../../../routes";
import {useMetaMaskAccount} from '../../../components/meta-mask-account-provider';
const RequestNew = ({ address, campaignManager }) => {
  const { connectedAccount, web } = useMetaMaskAccount();

  const [requestData, setRequestData] = useState({
    description: "",
    value: "",
    recipient: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputChangeHandler = (e) => {
    setRequestData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const campaign = Campaign(address);
    const { description, value, recipient } = requestData;
    if((description === '')||(value === '')||(recipient === '')){
        setErrorMessage('Inputs are empty');
        return;
    }
    setLoading(true);
    setErrorMessage("");
    try {
      const [account] = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, "ether"), recipient)
        .send({
          from: account,
        });
    } catch (error) {
      setErrorMessage(error.message);
    }
    setLoading(false);
    Router.pushRoute(`/campaigns/${address}/requests`);
  };

  return (
    <Layout>
      <Link route={`/campaigns/${address}/requests`}>
          <a>
            Back
          </a>
      </Link>
      {(web.utils.toChecksumAddress(connectedAccount) == campaignManager) && 
        <>
          <h3>Create a Request</h3>
          <Form onSubmit={onSubmit} error={!!errorMessage}>
            <Form.Field>
              <label>Description</label>
              <Input
                name="description"
                value={requestData.description}
                onChange={inputChangeHandler}
              />
            </Form.Field>
            <Form.Field>
              <label>Value in Ether</label>
              <Input
                name="value"
                value={requestData.value}
                onChange={inputChangeHandler}
              />
            </Form.Field>
            <Form.Field>
              <label>Recipient</label>
              <Input
                name="recipient"
                value={requestData.recipient}
                onChange={inputChangeHandler}
              />
            </Form.Field>
            <Message error header="Oops!" content={errorMessage}/>
            <Button primary loading={loading}>Create Request</Button>
          </Form>
        </>
      }
     
    </Layout>
  );
};

RequestNew.getInitialProps = async(ctx) => {
  const campaign = Campaign(ctx.query.address);
  const campaignManager = await campaign.methods.manager().call();
  return {
    address: ctx.query.address,
    campaignManager
  };
};

export default RequestNew;
