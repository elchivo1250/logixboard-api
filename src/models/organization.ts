import { QueryError, ObjectResult, BooleanResult, DatabaseModel } from './databaseModel';

export const TABLE_NAME = 'organization';
export type OrganizationResult = Organization | QueryError;

export interface IOrganization {
  id: string;
  code: string;
}

export class Organization {
  id: string;
  code: string;

  constructor({ id, code }: IOrganization) {
    this.id = id;
    this.code = code;
  }

  static async create({ id, code }: { id: string, code: string }): Promise<OrganizationResult> {
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`id\`, \`code\`) VALUES (?, ?)`;
    const params: string[] = [id, code];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Organization({ id, code });
  }

  static async update({ id, code }: { id: string, code: string }): Promise<OrganizationResult> {
    const query: string = `UPDATE \`${TABLE_NAME}\` SET \`code\` = ? WHERE id = ?`;
    const params: string[] = [code, id];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Organization({ id, code });
  }

  static async upsert({ id, code }: { id: string, code: string }): Promise<OrganizationResult> {
    const query: string = `INSERT INTO \`${TABLE_NAME}\` (\`id\`, \`code\`) VALUES (?, ?) ON DUPLICATE KEY UPDATE \`code\` = ?`;
    const params: string[] = [id, code, code];

    const result: BooleanResult = await DatabaseModel.booleanQuery({ query, params });

    return result instanceof QueryError ? result : new Organization({ id, code });
  }

  static async get(id: string): Promise<OrganizationResult> {
    const query: string = `SELECT * FROM \`${TABLE_NAME}\` WHERE id = ?`;
    const params: string[] = [id];

    const result: ObjectResult = await DatabaseModel.objectQuery({ query, params });

    if (result instanceof QueryError) {
      return result as QueryError;
    }

    return result.length === 0 ? new QueryError('Organization not found') : new Organization(result[0] as IOrganization);
  }

}