const express = require('express');
const bodyParser = require("body-parser");

import { dbPool } from './db';

import { Organization, OrganizationResult } from './models/organization';
import { Shipment, ShipmentResult } from './models/shipment';
import { ShipmentNode, ShipmentNodeResult, AggregateWeightResult } from './models/shipmentNode';
import { OrganizationShipment, OrganizationShipmentResult } from './models/organizationShipment';
import { QueryError } from './models/databaseModel';

const app = express();
app.use(bodyParser.json());
const port = 3000;

app.post('/shipment', async (req: any, res: any) => {
  const userInput: any = req.body;


  if (!userInput || !userInput.type || userInput.type != 'SHIPMENT') {
    return console.error(`Invalid input to /shipment: ${JSON.stringify(userInput)}`);
  }

  console.info(`Inserting shipment: ${JSON.stringify(userInput)}`);

  //await dbPool.query('START TRANSACTION');

  userInput.estimatedTimeArrival = !!userInput.estimatedTimeArrival ? new Date(userInput.estimatedTimeArrival) : null;

  const shipmentResult: ShipmentResult = await Shipment.upsert(userInput);

  if (shipmentResult instanceof QueryError) {
    console.error(`There was a problem upserting the shipment: ${JSON.stringify(shipmentResult)}`);
    res.json(shipmentResult);
    //await dbPool.query('ROLLBACK');
    return;
  }

  console.info('Successfully upserted shipment');

  const shipment: Shipment = shipmentResult as Shipment;

  try {
    await ShipmentNode.deleteByShipment(shipment.referenceId);
    await OrganizationShipment.deleteByShipment(shipment.referenceId);
  } catch (err) {
    console.error(`There was a problem clearing existing nodes and organizations from the shipment`);
    //await dbPool.query('ROLLBACK');
    res.json(shipmentResult);
    return;
  }

  let shipmentNodeResult: Promise<ShipmentNodeResult>[] = [];
  if (userInput.transportPacks && userInput.transportPacks.nodes && userInput.transportPacks.nodes.length > 0) {
    console.info('Updating shipment nodes');

    shipmentNodeResult = await Promise.all(userInput.transportPacks.nodes.map(async (shipmentNode: any) => {
      const { weight, unit }: { weight: number, unit: string } = shipmentNode.totalWeight;
      return await ShipmentNode.create({ weight, unit, shipmentId: shipment.referenceId });
    }));

    console.info('Shipment nodes updated');
  }

  let organizationShipmentResult: Promise<OrganizationShipmentResult>[] = [];
  if (userInput.organizations && userInput.organizations.length > 0) {
    console.info('Updating organization shipment relationships');

    // Transactions hang here. Didn't have time to investigate.
    organizationShipmentResult = await Promise.all(userInput.organizations.map(async (organizationCode: string) => {
      return await OrganizationShipment.create({ shipmentId: shipment.referenceId, organizationCode });
    }));

    console.info('Organization shipment relationships updated');
  }

  //await dbPool.query('COMMIT');

  res.json([shipmentResult, ...shipmentNodeResult, ...organizationShipmentResult]);
});

app.post('/organization', async (req: any, res: any) => {
  const userInput: any = req.body;

  console.info(`Inserting organization: ${JSON.stringify(userInput)}`);

  if (!userInput || !userInput.type || userInput.type != 'ORGANIZATION') {
    return console.error(`Invalid input to /organization : ${JSON.stringify(userInput)}`);
  }

  const orgResult: OrganizationResult = await Organization.upsert(userInput);

  if (orgResult instanceof QueryError) {
    console.error(`There was a problem upserting the organization: ${JSON.stringify(orgResult)}`);
    res.json(orgResult);
    return;
  }

  console.info('Successfully upserted organization');

  res.json(orgResult);
});

app.get('/shipments/:shipmentId', async (req: any, res: any) => {
  console.log(req.params);
  if (!req.params || !req.params.shipmentId) {
    console.error(`Invalid user input for /shipments/:shipmentId: ${JSON.stringify(req.params)}`);
    res.json({
      message: 'There was a problem with your request'
    });

    return;
  }

  const result: ShipmentResult = await Shipment.get(req.params.shipmentId);

  if (result instanceof QueryError) {
    console.error(`Error getting shipment: ${result.message}`);
  }

  res.json(result);
});

app.get('/organizations/:organizationId', async (req: any, res: any) => {
  console.log(req.params);
  if (!req.params || !req.params.organizationId) {
    console.error(`Invalid user input for /organizations/:organizationId: ${JSON.stringify(req.params)}`);
    res.json(new QueryError('There was a problem with your request'));
    return;
  }

  const result: OrganizationResult = await Organization.get(req.params.organizationId);

  if (result instanceof QueryError) {
    console.error(`Error getting organization: ${result.message}`);
  }

  res.json(result);
});

app.get('/shipments/aggregate-weight/:unit', async (req: any, res: any) => {
  console.log(req.params);
  if (!req.params || !req.params.unit) {
    console.error(`Invalid user input for /shipments/aggregate-weight/:unit: ${JSON.stringify(req.params)}`);
    res.json({
      message: 'There was a problem with your request'
    });

    return;
  }

  const result: AggregateWeightResult = await ShipmentNode.getAggregateWeight(req.params.unit);

  if (result instanceof QueryError) {
    console.error(`Error getting aggregate weight: ${result.message}`);
  }

  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
