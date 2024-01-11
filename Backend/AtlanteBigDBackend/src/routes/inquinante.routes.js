import { Router } from 'express';
import { create, findAll} from "../controllers/inquinante.controller";

const router = Router();

// Create a new Inquinante
router.post("/", create);

// Retrieve all 
router.get("/getAll", findAll);

export default router;