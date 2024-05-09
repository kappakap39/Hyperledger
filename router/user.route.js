import express from 'express';
import { 
    add_user,
} from '../controller/user_account.js';

const router_user = express.Router();

router_user.post('/add', add_user);

export default router_user;
