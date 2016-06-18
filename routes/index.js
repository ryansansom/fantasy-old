import { Router } from 'express';
const router = Router();

router.get('/', function(req, res) {
  return res.send({"hello": "test"});
});

export default router;
