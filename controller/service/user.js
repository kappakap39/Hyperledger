import { 
    add_user_data, 
    get_all_user_data, 
    get_by_id_user_data, 
    edit_user_data,
    delete_user_data,
    add_data_userWallets,

} from '../../services/index.js';


const add_user = async (req, res) => {
    try {
        const { 
            username,
            fristname,
            lastname,
            id_gard,
            tel,
            address,
            namebank,
            sourceAccount,
            amount,

         } = req.body;
         //! add
        // const result = await add_user_data( 
        const result = await add_data_userWallets( 
            username,
            fristname,
            lastname,
            id_gard,
            tel,
            address,
            namebank,
            sourceAccount,
            amount,

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

const get_all_user = async (req, res) => {
    const result = await get_all_user_data();

    if (result.error) {
        return res.status(500).json({ error: result.error });
    }

    return res.status(200).json(result);
};


const get_by_id_user = async (req, res) => {
    const { id_user } = req.body;
    const result = await get_by_id_user_data(id_user);

    if (result.error) {
        if (result.error === 'id_user not found') {
            return res.status(404).json({ error: result.error });
        }
        return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result);
};

const edit_user = async (req, res) => {
    // รับข้อมูลจาก req.body
    const { 
        id_user,
        username,
        fristname,
        lastname,
        id_gard,
        tel,
        address,

     } = req.body;

    try {
        // เรียกฟังก์ชัน UPDateHash พร้อมพารามิเตอร์ที่ต้องการ
        const updatedData = await edit_user_data(
            id_user,
            username,
            fristname,
            lastname,
            id_gard,
            tel,
            address,
        );

        // ส่ง HTTP status code 200 พร้อมข้อมูลที่อัพเดทแล้ว
        return res.status(200).json({ message: 'Update', data: updatedData });
    } catch (error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code 400 พร้อมข้อความข้อผิดพลาด
        return res.status(400).json({ error: error.message });
    }
};

const delete_user = async (req, res) => {
    const { id_user } = req.body;
    const result = await delete_user_data(id_user);

    if (result.error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code ที่เหมาะสม
        return res.status(400).json({ error: result.error });
    }

    // ส่งผลลัพธ์ที่ลบได้
    return res.status(200).json({ message: 'Delete', data: result });
};

export {
    add_user,
    get_all_user,
    get_by_id_user,
    edit_user,
    delete_user,
}