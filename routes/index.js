import { Router } from 'express';
import testData from './test-data';
const router = Router();

router.get('/', function(req, res) {
  return res.send({"hello": "test"});
});

router.get('/test', testData);

export default router;
