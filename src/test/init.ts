// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

import Application from '../app';
import { } from 'mocha';

import { db } from '../models';
import { utils } from './utilsForTests';

const application = new Application();

application.initExpressConnection();

before(async () => {
  await db.Image.create({ path: '1234', public_id: '1234', folder: 'avatar', caption: 'default' })
  await db.Category.create({category: 'antiques'})
  await db.Category.create({category: 'appliances'})
})

after(async () => {
  await utils.dropAllCollections();
  await db.Image.remove({});
})

export const expressServer = application.getExpressServer();
