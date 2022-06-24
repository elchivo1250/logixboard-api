import { ShipmentNode, ShipmentNodeAttributes, ShipmentNodeInput, ShipmentNodeOutput } from '../models';
import { connection as sequelize } from '../db';
import generateRepository from './repository';
import { convertWeight } from '../utils/weight';

const repository: any = generateRepository<ShipmentNode, ShipmentNodeInput, ShipmentNodeOutput, ShipmentNodeAttributes>('ShipmentNode', ShipmentNode);

repository.destroyByShipment = async (shipmentReferenceId: string): Promise<number> => {
  const options: object = {
    where: {
      shipmentReferenceId,
    },
  };

  return await ShipmentNode.destroy(options)
};

repository.getAggregateWeight = async (unit: string): Promise<ShipmentNodeOutput> => {
  const shipmentNodes: ShipmentNodeOutput[] = await ShipmentNode.findAll({
    attributes: [
      'unit',
      [sequelize.fn('sum', sequelize.col('weight')), 'weight']
    ],
    group: ['unit'],
  });

  return shipmentNodes.reduce((prev: ShipmentNodeOutput, curr: ShipmentNodeOutput) => {
    return {
      ...prev,
      weight: prev.weight + convertWeight(curr.weight, curr.unit, unit),
    }
  }, new ShipmentNode({ id: 0, weight: 0, unit}))
};


export default repository;