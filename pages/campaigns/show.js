import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import ContributeForm from "../../components/ContributeForm";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";

const CampaignShow = ({
  minimumContribution,
  contractBalance,
  approversCount,
  manager,
  numOfRequests,
  address,
}) => {
  const renderCards = () => {
    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "The manager created this campaign & can create requests to withdraw money",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description: "You must contribute this much wei to become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: numOfRequests,
        meta: "Number of Requests",
        description:
          "A request to withdraw money from contract. Request must be approved by the approvers",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of Approvers",
        description:
          "Number of people who have already donated to this campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(contractBalance, "ether"),
        meta: "Campaign Balance(ether)",
        description:
          "balance is how much money this campaign has left to spend.",
        style: { overflowWrap: "break-word" },
      },
    ];
    return <Card.Group items={items} />;
  };
  return (
    <Layout>
      <h3>Campaign Show</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={6}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link route={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Layout>
  );
};

CampaignShow.getInitialProps = async (ctx) => {
  const addr = ctx.query.address;
  const campaignInstance = Campaign(addr);

  const contractSummary = await campaignInstance.methods.getSummary().call();

  return {
    minimumContribution: contractSummary[0],
    contractBalance: contractSummary[1],
    numOfRequests: contractSummary[2],
    approversCount: contractSummary[3],
    manager: contractSummary[4],
    address: addr,
  };
};

export default CampaignShow;
