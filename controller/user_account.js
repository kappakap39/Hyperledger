import { PrismaClient } from '@prisma/client';
import { 
    add_user_data,

} from '../services/index.js';


const add_user = async (req, res) => {
    try {
        const { 
            username,
            fristname,
            lastname,
            id_gard,
            tel,
            address,

         } = req.body;
        const result = await add_user_data( 
            username,
            fristname,
            lastname,
            id_gard,
            tel,
            address,
         );
        
        // ส่ง HTTP response ด้วย status code 200
        return res.status(200).json(result);
    } catch (error) {
        // ตรวจสอบประเภทของข้อผิดพลาดและส่ง status code ที่เหมาะสม
        if (error instanceof ValidationError) {
            // หากเป็นข้อผิดพลาดที่เกี่ยวข้องกับการตรวจสอบความถูกต้องของข้อมูล
            return res.status(400).json({ error: 'Invalid input data' });
        } else if (error instanceof DatabaseError) {
            // หากเป็นข้อผิดพลาดที่เกี่ยวข้องกับฐานข้อมูล
            return res.status(500).json({ error: 'Database error' });
        } else {
            // หากเป็นข้อผิดพลาดประเภทอื่นๆ
            return res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
};


export {
    add_user,
}