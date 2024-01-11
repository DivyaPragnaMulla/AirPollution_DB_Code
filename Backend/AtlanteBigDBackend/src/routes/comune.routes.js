import { Router } from 'express';
import { create } from "../controllers/comune.controller";

const router = Router();

// Create a new Comune
router.post("/", create);

export default router;