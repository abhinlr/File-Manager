import express from "express";

import fileController from "../controllers/fileController.js";
import authCheck from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authCheck, fileController.uploadFile);

router.get("/get", authCheck, fileController.getFile);

router.patch("/:id", authCheck, fileController.renameFile);

router.get("/getAll", authCheck, fileController.getAllFiles);

router.delete("/:id", authCheck, fileController.deleteFile);

export default router;