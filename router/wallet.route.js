import express from 'express';
import { 
    connect_wallet,

} from '../controller/wallet.js';

const router_wallet = express.Router();

router_wallet.post('/', connect_wallet);

export default router_wallet;
