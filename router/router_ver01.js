import express from 'express';
import routerGenerate from './generate.route.js';
import router_user from './user.route.js';

const router_ver01 = express.Router();

// กำหนดเส้นทางต่างๆ
router_ver01.use('/generate', routerGenerate);
router_ver01.use('/User/data', router_user);

export default router_ver01;

