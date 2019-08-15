import * as express from "express";

import * as categoryController from '../../controllers/categoryController';


const router: express.Router = express.Router();


router.get("/", categoryController.getAllCategories);

router.get("/:category", categoryController.getCategory);

export const categoryRouter = router;
