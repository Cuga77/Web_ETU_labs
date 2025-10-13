import express from 'express';
import * as userController from '../controllers/userController.js';
import * as followController from '../controllers/followController.js';
import * as postController from '../controllers/postController.js';
import * as chatController from '../controllers/chatController.js';
import {uploadImage} from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.get('/user', userController.getAllUsers);
router.post('/user/filter', userController.getUsersByQuery);
router.get('/user/:id', userController.getUserById);
router.get('/user/:id/following', userController.getUserFollowing);
router.get('/user/:id/followers', userController.getUserFollowers);
router.get('/user/:id/chats', userController.getUserChats);
router.get('/user/:id/posts', userController.getUserPosts);
router.post('/user', uploadImage.single('avatar'), userController.registerUser);
router.post('/user/login', userController.loginUser);
router.patch('/user/:id', uploadImage.single('avatar'), userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/subscribe', followController.followUser);
router.post('/post', uploadImage.array('media', 3), postController.createPost);
router.get('/post', postController.getAllPosts);
router.get('/post/:id', postController.getPostById);
router.get('/feed/:id', postController.getUserFeed);
router.get('/chat/:id', chatController.getChatById);
router.post('/chat', chatController.createChat);
router.post('/chat/:id', chatController.sendMessageToChat);
router.get('/chat/:id/messages', chatController.getChatMessages);

export default router;