import { Organization, OrganizationAttributes, OrganizationInput, OrganizationOutput } from './organization';
import { OrganizationShipment, OrganizationShipmentAttributes, OrganizationShipmentInput, OrganizationShipmentOutput } from './organizationShipment';
import { Shipment, ShipmentAttributes, ShipmentInput, ShipmentOutput } from './shipment';
import { ShipmentNode, ShipmentNodeAttributes, ShipmentNodeInput, ShipmentNodeOutput } from './shipmentNode';

// All associations must be created in the same file. Wat?
Organization.belongsToMany(Shipment, { through: OrganizationShipment });
Shipment.belongsToMany(Organization, { through: OrganizationShipment });

Organization.hasMany(OrganizationShipment);
OrganizationShipment.belongsTo(Organization);

Shipment.hasMany(OrganizationShipment);
OrganizationShipment.belongsTo(Shipment);

Shipment.hasMany(ShipmentNode);
ShipmentNode.belongsTo(Shipment);

export {
  Organization,
  OrganizationAttributes,
  OrganizationInput,
  OrganizationOutput,
  Shipment,
  ShipmentAttributes,
  ShipmentInput,
  ShipmentOutput,
  ShipmentNode,
  ShipmentNodeAttributes,
  ShipmentNodeInput,
  ShipmentNodeOutput,
  OrganizationShipment,
  OrganizationShipmentAttributes,
  OrganizationShipmentInput,
  OrganizationShipmentOutput,
}