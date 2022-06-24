import { FindOptions } from 'sequelize';
import { NotFoundError } from '../db';

interface ModelInterface {
  create: Function;
  update: Function;
  upsert: Function;
  bulkCreate: Function;
  findByPk: Function;
  findAll: Function;
}

const generateRepository = <ModelClass, InputInterface, OutputInterface, AttributesInterface>(className: string, modelClass: ModelInterface) => {

  const NOT_FOUND = `${className} not found`;

  const create = async (payload: InputInterface, options?: object): Promise<OutputInterface> => {
    return await modelClass.create(payload, options);
  };

  const bulkCreate = async (payload: InputInterface[], options?: object): Promise<OutputInterface[]> => {
    return await modelClass.bulkCreate(payload, options);
  };

  const update = async (id: string, payload: Partial<InputInterface>, options?: any): Promise<OutputInterface> => {
    const instance = await modelClass.findByPk(id);

    if (!instance) {
      throw new NotFoundError(NOT_FOUND);
    }

    return await instance.update(payload, options);
  };

  const upsert = async (payload: Partial<InputInterface>, options?: object): Promise<OutputInterface> => {
    return await modelClass.upsert(payload, options);
  };

  const getById = async (id: string, findOptions?: object): Promise<OutputInterface> => {
    const instance = await modelClass.findByPk(id, findOptions);

    if (!instance) {
      throw new NotFoundError(NOT_FOUND)
    }

    return instance;
  };

  const getAll = async(findOptions?: FindOptions<ModelClass>): Promise<ModelClass[]> => {
    return await modelClass.findAll(findOptions);
  };

  return {
    NOT_FOUND,
    create,
    bulkCreate,
    update,
    upsert,
    getById,
    getAll,
  };
};

export default generateRepository;


