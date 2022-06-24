import { 
  Organization, 
  Shipment, 
  ShipmentNode, 
  OrganizationShipment,
} from './models';

const isProduction = process.env.NODE_ENV === 'production';
const options = {
  alter: !isProduction,
};

const dbInit = () => {
  Organization.sync(options);
  Shipment.sync(options);
  ShipmentNode.sync(options);
  OrganizationShipment.sync(options);
};

export default dbInit;