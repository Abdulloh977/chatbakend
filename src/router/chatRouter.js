import express from 'express';

import chatCtrl from '../controller/chatCtrl.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/chat/:firstId/:senderId', authMiddleware, chatCtrl.createChat)
router.get('/chat', authMiddleware, chatCtrl.userChats)
router.delete('/user/:id', authMiddleware, chatCtrl.deleteChat)



export default router