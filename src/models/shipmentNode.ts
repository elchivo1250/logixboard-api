import { QueryError, ObjectResult, BooleanResult, DatabaseModel } from './databaseModel';
import { convertWeight } from '../utils/weight';

export type ShipmentNodeResult = ShipmentNode | QueryError;
export type AggregateWeightResult = IAggregateWeight | QueryError;

export interface IShipmentNode {
  shipmentId: string;
  weight: number;
  unit: string;
}

export interface IAggregateWeight {
  weight: number;
  unit: string;
}

export const TABLE_NAME = 'shipment_node';

export class ShipmentNode {
  shipmentId: string;
  weight: number;
  unit: string;

  constructor({ shipmentId, weight, unit }: { shipmentId: string, weight: number, unit: string }) {
    this.shipmentId = shipmentId;
    this.weight = weight;
    this.unit = unit;
  }

  static async create({ shipmentId, weight, unit }: {  shipmentId: string, weight: number, unit: string }): Promise<ShipmentNodeResult> {
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`shipment_id\`, \`weight\`, \`unit\`) VALUES (?, ?, ?)`;
    const params: any[] = [shipmentId, weight, unit];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new ShipmentNode({ shipmentId, weight, unit });
  }

  static async deleteByShipment(shipmentId: string): Promise<BooleanResult> {
    const query: string = `DELETE FROM \`${TABLE_NAME}\` WHERE shipment_id = ?`;
    const params: any[] = [shipmentId];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result;
  }

  static async getAggregateWeight(unit: string) : Promise<AggregateWeightResult> {
    const query: string = `SELECT SUM(weight) AS weight, unit FROM \`${TABLE_NAME}\` GROUP BY unit`;
    const params: any[] = [];

    const result: ObjectResult = await DatabaseModel.objectQuery({ query, params });

    if (result instanceof QueryError) {
      return result as QueryError;
    } else if (result.length === 0) {
      return new QueryError('No shipments found');
    } 

    const aggregates = result as IAggregateWeight[];

    return aggregates.reduce((prev: IAggregateWeight, curr: IAggregateWeight) => {
      console.log(`prev weight = ${prev.weight} ${unit}`);
      console.log(`curr weight = ${curr.weight} ${curr.unit} `);
      console.log(`curr weight converted to = ${convertWeight(curr.weight, curr.unit, unit)} ${unit} `);
      return {
        ...prev,
        weight: prev.weight + convertWeight(curr.weight, curr.unit, unit),
      }
    }, { weight: 0, unit})
  }
}