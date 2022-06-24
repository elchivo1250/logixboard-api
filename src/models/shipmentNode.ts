import { Model, DataTypes } from 'sequelize';
import { connection } from '../db';
import { 
  Shipment,
} from './shipment';

export interface ShipmentNodeAttributes {
  id: number;
  weight: number;
  unit: string;
}

export interface ShipmentNodeInput extends ShipmentNodeAttributes {}
export interface ShipmentNodeOutput extends ShipmentNodeAttributes {}

export class ShipmentNode extends Model<ShipmentNodeAttributes, ShipmentNodeInput> implements ShipmentNodeAttributes  {
  public id: number;
  public weight: number;
  public unit: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ShipmentNode.init({
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  sequelize: connection,
});