const { dbPool }: { dbPool: any } = require('./db');

let exitCode = 0;

const createTables = async () => {
  try {
    await dbPool.query(`CREATE TABLE organization (
      id VARCHAR(255) NOT NULL PRIMARY KEY,
      code VARCHAR(10) NOT NULL UNIQUE
    )`);
  } catch (err) {
    exitCode = 1;
    console.error(err);
  }

  try {
    await dbPool.query(`CREATE TABLE shipment (
      reference_id VARCHAR(255) NOT NULL PRIMARY KEY,
      estimated_time_arrival DATETIME 
    )`);
  } catch (err) {
    exitCode = 1;
    console.error(err);
  }

  try {
    await dbPool.query(`CREATE TABLE shipment_node (
      id BIGINT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      shipment_id VARCHAR(255) NOT NULL,
      weight FLOAT NOT NULL,
      unit VARCHAR(50) NOT NULL,
      FOREIGN KEY (shipment_id)
        REFERENCES shipment(reference_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    )`);
  } catch (err) {
    exitCode = 1;
    console.error(err);
  }

  try {
    await dbPool.query(`CREATE TABLE organization_shipment (
      organization_code VARCHAR(255) NOT NULL,
      shipment_id VARCHAR(255) NOT NULL,
      PRIMARY KEY (organization_code, shipment_id),
      FOREIGN KEY (organization_code)
        REFERENCES organization(code)
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
      FOREIGN KEY (shipment_id)
        REFERENCES shipment(reference_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
    )`);
  } catch (err) {
    exitCode = 1;
    console.error(err);
  }

  process.exit(exitCode);
};

createTables();