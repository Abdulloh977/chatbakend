import express from 'express';

import userCtrl from '../controller/userCtrl.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/users', authMiddleware, userCtrl.getAll)
router.get('/user/:id', authMiddleware, userCtrl.getOne)
router.delete('/user/:id', authMiddleware, userCtrl.deleteUser)
router.put('/user/:id', authMiddleware, userCtrl.updateUser)



export default router