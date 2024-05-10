import express from 'express';
import { 
    connect_wallet,
} from '../controller/service/wallet.js';
import { 
    web3_check_money,
    ethersCheckMoney,
} from '../controller/index.js';

const router_wallet = express.Router();

router_wallet.post('/wallet', connect_wallet);

//!server
router_wallet.post('/web3/check/money', web3_check_money);
router_wallet.post('/ethersCheckMoney', ethersCheckMoney);

export default router_wallet;
