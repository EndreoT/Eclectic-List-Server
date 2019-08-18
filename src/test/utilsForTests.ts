// const asyncForEach = require('../scripts/utils').asyncForEach;
import {db} from '../models';

export const utils = {
  post: {
    subject: 'Test title',
    description: 'Test Description',
    price: 0,
    category: 'antiques',
  },

  user: {
    username: 'testuser',
    password: '12345',
    email: 'user@email.com'
  },

  async dropAllCollections () {
    await db.User.remove({});
    await db.Post.remove({});
    await db.Comment.remove({});
  },
};


