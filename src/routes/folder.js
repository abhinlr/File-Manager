import express from "express";

const router = express.Router();

import folderController from "../controllers/folderController.js";
import authCheck from '../middlewares/authMiddleware.js';

router.post('/create', authCheck, folderController.createFolder);
router.patch('/rename', authCheck, folderController.renameFolder);
router.delete('/:id', authCheck, folderController.deleteFolder);
router.get('/getAll', authCheck, folderController.getFolderContents);

export default router;