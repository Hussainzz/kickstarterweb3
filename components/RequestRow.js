import React from "react";
import { Table, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";

const RequestRow = ({ request, address, id, approversCount}) => {
  const { Row, Cell } = Table;
  const readyToFinalize = request.approvalCount > approversCount / 2;
  const onApprove = async () => {
    const campaign = Campaign(address);
    const [account] = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(id).send({
      from: account,
    });
  };

  const onFinalize = async () => {
    const campaign = Campaign(address);
    const [account] = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequests(id).send({
      from: account,
    });
  };
  return (
    <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
      <Cell>{id}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>
        {request.approvalCount}/{approversCount}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="green" basic onClick={onApprove}>
            Approve
          </Button>
        )}
      </Cell>
      <Cell>
        {request.complete ? null : (
          <Button color="teal" basic onClick={onFinalize}>
            Finalize
          </Button>
        )}
      </Cell>
    </Row>
  );
};

export default RequestRow;
