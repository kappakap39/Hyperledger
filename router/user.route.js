import express from 'express';
import { 
    add_user,
    get_all_user,
    get_by_id_user,
    edit_user,
    delete_user,

} from '../controller/user.js';

const router_user = express.Router();

router_user.post('/add', add_user);
router_user.get('/get_all', get_all_user);
router_user.get('/get_by_id', get_by_id_user);
router_user.patch('/edit', edit_user);
router_user.delete('/delete', delete_user);

export default router_user;
