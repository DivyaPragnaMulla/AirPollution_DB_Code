import { Router } from 'express';
import { 
    calcoloBurdenByProvincia,
    calcoloImpactAssessmentByProvinciaAllNaturalCases,
    calcoloImpactAssessmenAllNaturalCases,
    calcoloBurdenAllProvince
} from "../controllers/airqplus.controller";

const router = Router();

//tipo di analisi BURDEN OF DISEASE
//fascia età dipende anche dall'health end point scelto, ci sono alcune malattie che permettono
//la scelta di una sola fascia d'età
//sigla della provincia per la quale si vuole fare l'analisi per un certo anno
router.get("/burden_of_disease/:metodo_calcolo/:fascia_eta/:sigla_provincia/:anno/:healthendpoint",calcoloBurdenByProvincia);
router.get("/burden_of_disease/tutteleprovince/:anno/:healthendpoint",calcoloBurdenAllProvince,);

//tipo analisi IMPACT ASSESSMENT
//health endpoint tutte le cause naturali per adulti oltre 30 anni di età
router.get("/impact_assessment/tutteCauseNaturali/log_linear/:sigla_provincia/:anno",calcoloImpactAssessmentByProvinciaAllNaturalCases);
router.get("/impact_assessment/tutteCauseNaturali/tutteleprovince/:anno",calcoloImpactAssessmenAllNaturalCases);

export default router;