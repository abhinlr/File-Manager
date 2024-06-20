import express from "express";

import folderController from "../controllers/folderController.js";
import authCheck from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', authCheck, folderController.createFolder);

router.patch('/rename', authCheck, folderController.renameFolder);

router.delete('/:id', authCheck, folderController.deleteFolder);

router.get('/getAll', authCheck, folderController.getFolderContents);

export default router;