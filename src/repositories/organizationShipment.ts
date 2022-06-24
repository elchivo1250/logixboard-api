import { OrganizationShipment, OrganizationShipmentAttributes, OrganizationShipmentInput, OrganizationShipmentOutput } from '../models';
import generateRepository from './repository';

const repository: any = generateRepository<OrganizationShipment, OrganizationShipmentInput, OrganizationShipmentOutput, OrganizationShipmentAttributes>('OrganizationShipment', OrganizationShipment);

repository.destroyByShipment = async (shipmentReferenceId: string): Promise<number> => {
  const options: object = {
    where: {
      shipmentReferenceId,
    },
  };

  return await OrganizationShipment.destroy(options)
};

export default repository;