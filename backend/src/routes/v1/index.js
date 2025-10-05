import express from "express";
import { pingCheck } from "../../controllers/pingControllers.js";

const router = express.Router();

router.use("/ping", pingCheck);

export default router;
