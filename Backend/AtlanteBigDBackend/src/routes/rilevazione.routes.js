import { Router } from 'express';
import { create, findAll,
  findAllPerProvincia_withYear,
  findAll_withYear,
  findByProvincia,
  findByProvincia_allYears,
  findAll_withPolluntant
} from "../controllers/rilevazione.controller";

const router = Router();

// Create a new Rilevazione
router.post("/", create);

// Retrieve all 
router.get("/", findAll);

//restituisce le rilevazioni per ogni anno di una provincia di un polluntant
router.post("/all-years/:provincia/getAll", findByProvincia_allYears); //con form data dell'inquinante

router.post("/province/:anno", findAllPerProvincia_withYear);
router.post("/province/:anno/:provincia", findByProvincia); //con form data dell'inquinante

router.post("/:anno", findAll_withYear);
router.post("/province/", findAll_withPolluntant);

export default router;