import { pingCheck } from "../../controllers/pingCheck.js";
import projectRouter from "./projects.js";
import express from "express";

const router = express.Router();
router.use("/ping", pingCheck);
router.use("/projects", projectRouter);
export default router;
