import { DataTypes, Model, Optional } from 'sequelize';
import { Organization } from './organization';
import { ShipmentNode } from './shipmentNode';
import { connection } from '../db';

export interface ShipmentAttributes {
  referenceId: string;
  estimatedTimeArrival: Date;
  organizations?: Organization[],
  shipmentNodes?: ShipmentNode[],
}

export interface ShipmentInput extends Optional<ShipmentAttributes, 'referenceId'> {}
export interface ShipmentOutput extends Required<ShipmentAttributes> {}


export class Shipment extends Model<ShipmentAttributes, ShipmentInput> implements ShipmentAttributes {
  public referenceId!: string;
  public estimatedTimeArrival: Date;
  public organizations?: Organization[];
  public shipmentNodes?: ShipmentNode[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Shipment.init({
  referenceId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  estimatedTimeArrival: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
  sequelize: connection,
});