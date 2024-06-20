import express from "express";

import authController from "../controllers/authController.js";
import authCheck from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup",authController.signup);

router.get("/login", authController.login);

router.get("/status",authCheck, (req,res)=>res.status(200).json({success:true,user:req.user}));

router.get("/logout", authController.logout);

export default router;