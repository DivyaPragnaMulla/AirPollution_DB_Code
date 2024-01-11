import { Router } from 'express';
import { findAll } from "../controllers/eta.controller";

const router = Router();

router.get("/getAll", findAll);

export default router;