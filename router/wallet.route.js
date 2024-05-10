import express from 'express';
import { 
    connect_wallet,
} from '../controller/service/wallet.js';
import { 
    web3_check_money,
} from '../controller/server/web3.js';

const router_wallet = express.Router();

router_wallet.post('/wallet', connect_wallet);
router_wallet.post('/web3/check/money', web3_check_money);

export default router_wallet;
