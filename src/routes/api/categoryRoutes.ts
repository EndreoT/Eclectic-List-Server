import * as express from "express";

import * as categoryController from '../../controllers/categoryController';


const router: express.Router = express.Router();


router.route('/')
  .get(categoryController.getAllCategories);

router.route('/:categoryId')
  .get(categoryController.getCategory);

export const categoryRouter = router;
