import { DataTypes, Model, Optional } from 'sequelize';
import { Shipment } from './shipment';
import { connection } from '../db';

export interface OrganizationAttributes {
  id: string;
  code: string;
  shipments?: Shipment[];
}

export interface OrganizationInput extends Optional<OrganizationAttributes, 'id'> {}
export interface OrganizationOutput extends Required<OrganizationAttributes> {}


export class Organization extends Model<OrganizationAttributes, OrganizationInput> implements OrganizationAttributes {
  public id!: string;
  public code!: string;
  public shipments?: Shipment[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Organization.init({
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  sequelize: connection,
});