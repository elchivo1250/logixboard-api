import { Shipment, ShipmentAttributes, ShipmentInput, ShipmentOutput } from '../models';
import generateRepository from './repository';

export default generateRepository<Shipment, ShipmentInput, ShipmentOutput, ShipmentAttributes>('Shipment', Shipment);