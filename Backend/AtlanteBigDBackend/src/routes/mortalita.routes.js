import { Router } from 'express';
import { 
	create, 
	findAll_withYear, 
	findByProvincia, 
	findMorti_allProvince_ByMalattiaAnno, 
	findByProvincia_allYears, 
    findMorti_ByMalattiaAnno
} from "../controllers/mortalita.controller";

const router = Router();

// Create a new Mortalita
router.post("/:min/:max", create);//you pass the minimum and maximum age as a parameter

router.get("/:anno", findAll_withYear);

// Retrieve a single Mortalita with IdMortalita
router.get("/:anno/:provincia", findByProvincia);
router.get("/all-years/:provincia/getAll", findByProvincia_allYears);

router.get("/:effetto/:min_eta/:max_eta", findMorti_allProvince_ByMalattiaAnno);
router.get("/get-all-province-by-disease/:anno/:effetto/:min_eta/:max_eta", findMorti_allProvince_ByMalattiaAnno);
router.get("/get-by-disease/:anno/:provincia/:effetto/:min_eta/:max_eta", findMorti_ByMalattiaAnno);

export default router;