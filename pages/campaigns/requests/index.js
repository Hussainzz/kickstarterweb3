import React from "react";
import { Button, Table } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import RequestRow from "../../../components/RequestRow";
import Campaign from "../../../ethereum/campaign";
import { Link } from "../../../routes";
import {useMetaMaskAccount} from '../../../components/meta-mask-account-provider';

const RequestIndex = ({ address, requests, requestCount, approversCount, campaignManager }) => {
  const { connectedAccount, web } = useMetaMaskAccount();

  const { Header, Row, HeaderCell, Body } = Table;

  const renderRow = () => {
    return requests.map((req, idx) => {
      return <RequestRow request={req} key={idx} address={address} id={idx} approversCount={approversCount} campaignManager={campaignManager} connectedAccount={connectedAccount}/>;
    });
  };
  return (
    <Layout>
      <h3>Requests</h3>
      <Link route={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{
              marginBottom:10
          }} disabled={(web) && (web.utils.toChecksumAddress(connectedAccount) != campaignManager)}>Add Requests</Button>
        </a>
      </Link>

      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount</HeaderCell>
            <HeaderCell>Recipient</HeaderCell>
            <HeaderCell>Approval Count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>
            {renderRow()}
        </Body>
      </Table>
      <div>Found {requestCount} requests.</div>
    </Layout>
  );
};

RequestIndex.getInitialProps = async (ctx) => {
  const addr = ctx.query.address;
  const campaign = Campaign(addr);

  const requestCount = await campaign.methods.getRequests().call();
  const approversCount = await campaign.methods.approversCount().call();
  const campaignManager = await campaign.methods.manager().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((e, i) => {
        return campaign.methods.requests(i).call();
      })
  );
  return {
    requestCount,
    requests,
    approversCount,
    address: addr,
    campaignManager
  };
};

export default RequestIndex;
