import { Router } from 'express';
import { 
    create, 
    createInquinanteCentralina
} from "../controllers/centralina.controller";

const router = Router();

// Create a new Centralina
router.post("/", create);
router.post("/inquinante", createInquinanteCentralina);

export default router;