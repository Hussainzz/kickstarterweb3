import React, { useEffect, useState } from "react";
import factory from "../ethereum/factory";
import { Card, Button } from "semantic-ui-react";
import Layout from "../components/Layout";
import { Link } from "../routes";
import { useMetaMaskAccount } from "../components/meta-mask-account-provider";

const CampaignIndex = () => {
  const [campaigns, setCampaigns] = useState([])
  const { web3, connectedAccount, connectAccount } = useMetaMaskAccount();
  
  useEffect(() => {
    if(connectedAccount){
        const getDeployedCampaigns = async() => {
          const allCampaigns = await factory.methods.getDeployedCampaigns().call();
          if(allCampaigns.length){
            setCampaigns(allCampaigns);
          }
        }
        getDeployedCampaigns();
        renderCampaigns();
    }
  },[connectedAccount])


  const renderCampaigns = () => {
    if(campaigns.length){
      const items = campaigns.map((campaignAddr) => {
        return {
          header: campaignAddr,
          description: (
            <Link route={`/campaigns/${campaignAddr}`}>
              <a>View Campaign</a>
            </Link>
          ),
          fluid: true,
        };
      });
      return <Card.Group items={items} />;
    }else{
      return <h3>No Campaigns Yet!.. Create One Now !</h3>;
    }
  };

  return (
    <Layout>
      <div>
        <h3>Open Campaigns</h3>
        {(connectedAccount)?
          <Link route="/campaigns/new">
            <a>
              <Button
                floated="right"
                content="Create Campaign"
                icon="add circle"
                primary
              />
            </a>
          </Link>
          :
            <Button
              floated="right"
              content="Connect to metamask"
              icon="add circle"
              primary
              onClick={connectAccount}
            />
        }
        {renderCampaigns()}
      </div>
    </Layout>
  );
};

export default CampaignIndex;
