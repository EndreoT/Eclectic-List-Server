import * as express from "express";

import * as imageController from '../../controllers/imageController';

const router: express.Router = express.Router();


// // get requests with image url are made directly to Cloudinary API

router.get('/', imageController.getAllImages);

router.get('/avatar', imageController.getAllAvatarImages);

router.get('/getImageById/:imageId', imageController.getImageById);

router.get('/getImagesForPost/:postId', imageController.getImagesForPost);

router.post('/postAvatar', imageController.postAvatarImage);

router.post('/postImage', imageController.postPostImage);

router.post('/postMultipleImages/:postId', imageController.postMultipleImages);

router.put('/setAvatarImage', imageController.setUserAvatarImage);

export const imageRouter = router;