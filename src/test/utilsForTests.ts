// const asyncForEach = require('../scripts/utils').asyncForEach;
import {db} from '../models';

export const utils = {
  // event: {
  //   title: 'Test title',
  //   description: 'Test Description',
  //   creator: '',
  // },

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

  // seedUsers: async (usersSeed) => {
  //   await asyncForEach(usersSeed, async (item, index) => {
  //     console.log(index);
  //     try {
  //       await User.create(item);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   });
  // },
};


