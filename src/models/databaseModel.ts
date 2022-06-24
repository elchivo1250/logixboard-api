import { dbPool } from '../db';

export class QueryError {
  message: string;

  constructor(message: string) {
    this.message = message;
  }
};

export type BooleanResult = boolean | QueryError;
export type ObjectResult = object[] | QueryError;

export class DatabaseModel {
  static async booleanQuery({ query, params }: { query: string, params: any[] }): Promise<BooleanResult> {

    let result: any; 
    let fields: any; 

    try {
      [result, fields] = await dbPool.execute(query, params);
    } catch (err) {
      console.error(JSON.stringify(err));
      return new QueryError(err.message);
    }

    return result.affectedRows >= 1;
  }

  static async objectQuery({ query, params }: { query: string, params: any[] }): Promise<ObjectResult> {

    let result: object[];
    let fields: any; 

    try {
      [result, fields] = await dbPool.execute(query, params);
    } catch (err) {
      console.error(JSON.stringify(err));
      return new QueryError(err.message);
    }

    return result;
  }
}