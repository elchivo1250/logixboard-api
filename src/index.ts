const express = require('express');
const bodyParser = require("body-parser");

import dbInit from './db-init';
dbInit();

import { 
  OrganizationRepository, 
  ShipmentRepository,
  ShipmentNodeRepository,
  OrganizationShipmentRepository,
} from './repositories';

import { 
  Organization, 
  OrganizationInput, 
  OrganizationOutput, 
  Shipment, 
  ShipmentInput, 
  ShipmentOutput,
  ShipmentNode, 
  ShipmentNodeOutput,
  OrganizationShipmentOutput,
} from './models';

import { NotFoundError } from './db';

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.post('/shipment', async (req: any, res: any) => {
  const userInput: any = req.body;

  if (!userInput || !userInput.type || userInput.type != 'SHIPMENT') {
    return console.error(`Invalid input to /shipment: ${JSON.stringify(userInput)}`);
  }

  const shipmentInput: ShipmentInput = req.body as ShipmentInput;

  const organizations: Organization[] = !!req.body.organizations ? await OrganizationRepository.getByCodes(req.body.organizations) : [];
  shipmentInput.organizations = organizations;

  const shipmentNodes: ShipmentNode[] = !!req.body.transportPacks && !!req.body.transportPacks.nodes ? req.body.transportPacks.nodes.map((node: any) => ({
    ...node.totalWeight,
  })) : [];

  shipmentInput.shipmentNodes = shipmentNodes;

  let shipmentOutput: ShipmentOutput;
  let shipment: Shipment;
  
  try {
    shipmentOutput = await ShipmentRepository.upsert(shipmentInput);

    await OrganizationShipmentRepository.destroyByShipment(shipmentInput.referenceId);
    const organizationShipmentResult: OrganizationShipmentOutput[] = await OrganizationShipmentRepository.bulkCreate(organizations.map((organization: Organization) => ({
      OrganizationId: organization.id,
      ShipmentReferenceId: shipmentInput.referenceId,
    })));

    await ShipmentNodeRepository.destroyByShipment(shipmentInput.referenceId);
    const shipmentNodeResult: ShipmentNodeOutput[] = await ShipmentNodeRepository.bulkCreate(shipmentInput.shipmentNodes.map((shipmentNode: ShipmentNode) => ({
      ...shipmentNode,
      ShipmentReferenceId: shipmentInput.referenceId,
    })));

    shipment = await ShipmentRepository.getById(shipmentInput.referenceId as string) as Shipment;
  } catch (err: any) {
    console.error(err.message);

    return res.json({
      statusCode: 500,
      message: 'There was a problem creating the shipment',
    });
  }

  res.json({
    statusCode: 200,
    data: shipment,
  });

});

app.post('/organization', async (req: any, res: any) => {
  const userInput: any = req.body;

  if (!userInput || !userInput.type || userInput.type != 'ORGANIZATION') {
    return console.error(`Invalid input to /organizaton: ${JSON.stringify(userInput)}`);
  }

  const organizationInput: OrganizationInput = req.body as OrganizationInput;

  let organizationOutput: OrganizationOutput;
  
  try {
    organizationOutput = await OrganizationRepository.upsert(userInput);
  } catch (err: any) {
    console.error(err.message);

    return res.json({
      statusCode: 500,
      message: 'There was a problem creating/updating the organization',
    });
  }

  const organization: Organization = organizationOutput as Organization;

  res.json({
    statusCode: 200,
    data: organization,
  });
});

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  if (!req.params || !req.params.shipmentId) {
    console.error(`Invalid user input for /shipments/:shipmentId: ${JSON.stringify(req.params)}`);
    res.json({
      statusCode: 400,
      message: 'There was a problem with your request'
    });

    return;
  }

  let result: ShipmentOutput;
  
  try {
    result = await ShipmentRepository.getById(req.params.shipmentId, {
      include: ['Organizations']
    });
  } catch (err: any) {
    console.log(JSON.stringify(err));

    const message = (err instanceof NotFoundError) ? 'The shipment could not be found' : 'There was a problem with your request';
    const statusCode = (err instanceof NotFoundError) ? 404 : 500;

    return res.json({
      statusCode,
      message,
    });

  }

  res.json(result as Shipment);
});

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  if (!req.params || !req.params.organizationId) {
    console.error(`Invalid user input for /organization/:organizationId: ${JSON.stringify(req.params)}`);

    res.json({
      statusCode: 400,
      message: 'There was a problem with your request'
    });

    return;
  }

  let result: OrganizationOutput;
  
  try {
    result = await OrganizationRepository.getById(req.params.organizationId);
  } catch (err: any) {
    console.log(JSON.stringify(err));

    const message = (err instanceof NotFoundError) ? 'The organization could not be found' : 'There was a problem with your request';
    const statusCode = (err instanceof NotFoundError) ? 404 : 500;

    return res.json({
      statusCode,
      message,
    });
  }

  res.json(result as Organization);
});

app.get('/shipments/aggregate-weight/:unit', async (req: any, res: any) => {
  if (!req.params || !req.params.unit) {
    console.error(`Invalid user input for /shipments/aggregate-weight/:unit: ${JSON.stringify(req.params)}`);
    res.json({
      statusCode: 400,
      message: 'There was a problem with your request'
    });

    return;
  }

  let result: ShipmentNode;

  try {
    result = await ShipmentNodeRepository.getAggregateWeight(req.params.unit);
  } catch (err: any) {
    console.error(JSON.stringify(err));
    res.json({
      statusCode: 500,
      message: 'There was a problem getting the aggregate weight',
    });

    return;
  }

  res.json({
    statusCode: 200,
    data: result
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
