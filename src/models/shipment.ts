import { QueryError, ObjectResult, BooleanResult, DatabaseModel } from './databaseModel';

const dayjs = require('dayjs');

export type ShipmentResult = Shipment | QueryError;
export type EstimatedTimeArrivalInputType = Date | string | null | undefined;
export type EstimatedTimeArrivalType = Date | null | undefined;

export interface IShipment{
  reference_id: string;
  estimated_time_arrival: EstimatedTimeArrivalInputType;
}

export const TABLE_NAME = 'shipment';

export class Shipment {
  referenceId: string;
  estimatedTimeArrival: Date | null | undefined;

  constructor({ referenceId, estimatedTimeArrival = null}: { referenceId: string, estimatedTimeArrival: EstimatedTimeArrivalType}) {
    this.referenceId = referenceId;

    if (estimatedTimeArrival !== null) {
      this.estimatedTimeArrival = estimatedTimeArrival instanceof Date ? estimatedTimeArrival : new Date(estimatedTimeArrival) ;
    }
  }

  static async create({ referenceId, estimatedTimeArrival }: { referenceId: string, estimatedTimeArrival: Date | null }): Promise<ShipmentResult> {
    const estimatedTimeArrivalField = estimatedTimeArrival !== null ? ", `estimated_time_arrival`" : '';
    const estimatedTimeArrivalValue = estimatedTimeArrival !== null ? ", ?": '';
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`reference_id\`${estimatedTimeArrivalField}) VALUES (?${estimatedTimeArrivalValue})`;
    const params: any[] = [referenceId];
    
    if (estimatedTimeArrival !== null) {
      params.push(dayjs(estimatedTimeArrival).format('YYYY-MM-DD HH:mm:ss'));
    }

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Shipment({ referenceId, estimatedTimeArrival });
  }

  static async update({ referenceId, estimatedTimeArrival }: { referenceId: string, estimatedTimeArrival: Date }): Promise<ShipmentResult> {
    const query: string = `UPDATE \`${TABLE_NAME}\` SET \`estimated_time_arrival\` = ? WHERE \`reference_id\` = ?`;
    const params: any[] = [dayjs(estimatedTimeArrival).format('YYYY-MM-DD HH:mm:ss'), referenceId];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Shipment({ referenceId, estimatedTimeArrival });
  }

  static async upsert({ referenceId, estimatedTimeArrival }: { referenceId: string, estimatedTimeArrival: Date | null }): Promise<ShipmentResult> {
    const estimatedTimeArrivalField = estimatedTimeArrival !== null ? ", `estimated_time_arrival`" : '';
    const estimatedTimeArrivalValue = estimatedTimeArrival !== null ? ", ?": '';
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`reference_id\`${estimatedTimeArrivalField}) VALUES (?${estimatedTimeArrivalValue}) ON DUPLICATE KEY UPDATE \`estimated_time_arrival\` = ?`;

    let params: any[] = [referenceId]
    
    if (estimatedTimeArrival !== null) {
      params = params.concat([dayjs(estimatedTimeArrival).format('YYYY-MM-DD HH:mm:ss'), dayjs(estimatedTimeArrival).format('YYYY-MM-DD HH:mm:ss')])
    } else {
      params.push(null);
    }

    console.log(`query = ${query}`);
    console.log(`params = ${JSON.stringify(params)}`);

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Shipment({ referenceId, estimatedTimeArrival });
  }

  static async get(referenceId: string): Promise<ShipmentResult> {
    const query: string = `SELECT * FROM \`${TABLE_NAME}\` WHERE reference_id = ?`;
    const params: string[] = [referenceId];

    const result: ObjectResult = await DatabaseModel.objectQuery({ query, params });

    if (result instanceof QueryError) {
      return result as QueryError;
    } else if (result.length === 0) {
      return new QueryError('Shipment not found');
    } 

    const ishipment = result[0] as IShipment;

    return new Shipment({
      referenceId: ishipment.reference_id,
      estimatedTimeArrival: !!ishipment.estimated_time_arrival && ishipment.estimated_time_arrival !== 'NULL' ? dayjs(ishipment.estimated_time_arrival, 'YYYY-MM-DD HH:mm:ss').toDate() : null,
    });
  }
}