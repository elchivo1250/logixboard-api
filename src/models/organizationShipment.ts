import { Model } from 'sequelize';
import { connection } from '../db';
import { Organization } from './organization';
import { Shipment } from './shipment';

export interface OrganizationShipmentAttributes {
  shipmentId: string;
  organizationId: string;
}

export interface OrganizationShipmentInput extends OrganizationShipmentAttributes {}
export interface OrganizationShipmentOutput extends OrganizationShipmentAttributes {}

export class OrganizationShipment extends Model  {
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OrganizationShipment.init({}, {
  timestamps: true,
  sequelize: connection,
});

// Define ALL the relationships to allow for eager loading
Organization.belongsToMany(Shipment, { through: OrganizationShipment });
Shipment.belongsToMany(Organization, { through: OrganizationShipment });

Organization.hasMany(OrganizationShipment);
OrganizationShipment.belongsTo(Organization);

Shipment.hasMany(OrganizationShipment);
OrganizationShipment.belongsTo(Shipment);