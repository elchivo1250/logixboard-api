import { QueryError, ObjectResult, BooleanResult, DatabaseModel } from './databaseModel';

export type OrganizationShipmentResult = OrganizationShipment | QueryError;

export interface IOrganizationShipment {
  organizationCode: string;
  shipmentId: string;
}

export const TABLE_NAME = 'organization_shipment';

export class OrganizationShipment {
  organizationCode: string;
  shipmentId: string;

  constructor({ organizationCode, shipmentId }: { organizationCode: string, shipmentId: string }) {
    this.organizationCode = organizationCode;
    this.shipmentId = shipmentId;
  }

  static async create({ organizationCode, shipmentId }: { organizationCode: string, shipmentId: string }): Promise<OrganizationShipmentResult> {
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`organization_code\`, \`shipment_id\`) VALUES (?, ?)`;
    const params: any[] = [organizationCode, shipmentId];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new OrganizationShipment({ organizationCode, shipmentId });
  }

  static async deleteByShipment(shipmentId: string): Promise<BooleanResult> {
    const query: string = `DELETE FROM \`${TABLE_NAME}\` WHERE shipment_id = ?`;
    const params: any[] = [shipmentId];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result;
  }
}