import { Router } from 'express';
import { 
    create,
    addCategoryAirqplus,
    findAll_airqplus
} from "../controllers/causemorte.controller";

const router = Router();

// Create a new Causa Morte
router.post("/", create);
router.post("/aggiungi-airqplus", addCategoryAirqplus);

router.get("/airq/getAll", findAll_airqplus);

export default router;