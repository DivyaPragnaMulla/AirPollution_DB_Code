//Express offers the Express Router to create modular routes without mounting them 
//directly to the Express application instance
import { Router } from 'express';
 
const router = Router();
 
router.get('/', (req, res) => {
  return res.send(req.context.models.users[req.context.me.id]);
});
 
export default router;