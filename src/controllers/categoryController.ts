import * as express from 'express';

import { ICategory, Category} from "../models/category";

export async function getAllCategories(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const categories: ICategory[] = await Category.find().sort({ category: 1 });
        return res.send(categories);
    } catch (error) {
        return next(error);
    }
}

export async function getCategory(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
        const categoryParam: string = req.params.categoryId;
        const category: ICategory | null = await Category.findOne({ category: categoryParam });
        if (category) { 
            return res.send(category);
        }
        return res.status(404).json({ message: `Category '${categoryParam}' does not exist.` });
    } catch (error) {
        return next(error);
    }
}
