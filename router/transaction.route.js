import express from 'express';

import { 
    Transaction_transfer,
} from '../controller/index.js';

const router_transaction = express.Router();

router_transaction.patch('/Transaction/transfer', Transaction_transfer);

export default router_transaction;
