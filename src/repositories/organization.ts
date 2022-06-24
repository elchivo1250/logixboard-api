import { FindOptions, Op } from 'sequelize';
import { Organization, OrganizationAttributes, OrganizationInput, OrganizationOutput } from '../models';
import generateRepository from './repository';

const repository: any = generateRepository<Organization, OrganizationInput, OrganizationOutput, OrganizationAttributes>('Organization', Organization);

repository.getByCodes = async (codes: string[]): Promise<Organization[]> => {
  const where: FindOptions<Organization> = {
    where: {
      code: {
        [Op.in]: codes,
      }
    },
  };

  return await Organization.findAll(where);
};

export default repository;