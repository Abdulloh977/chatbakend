import express from 'express';

import messageCtrl from '../controller/messageCtrl.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/message', authMiddleware, messageCtrl.createMessage)
router.get('/message/:id', authMiddleware, messageCtrl.getMessage)
router.delete('/message/:id', authMiddleware, messageCtrl.deleteMessage)



export default router