import { Router, type IRouter } from "express";
import healthRouter from "./health";
import shopsRouter from "./shops";

const router: IRouter = Router();

router.use(healthRouter);
router.use(shopsRouter);

export default router;
