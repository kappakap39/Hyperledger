import express from 'express';
import routerGenerate from './generate.route.js';
import router_user from './user.route.js';
import router_wallet from './wallet.route.js';
import router_transaction from './transaction.route.js';
import router_penAI from './other/OpenAI.js';

const router_ver01 = express.Router();

// กำหนดเส้นทางต่างๆ
router_ver01.use('/generate', routerGenerate);
router_ver01.use('/User/data', router_user);
router_ver01.use('/User/data/wallet', router_wallet);
router_ver01.use('/User/data/', router_transaction);
router_ver01.use('/OpenAi/chat', router_penAI);

export default router_ver01;

