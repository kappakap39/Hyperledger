import { 
    GenerateSHA, 
    Generate,
    getData_gen,
    getByHash,
    DecryptHash,
    UPDateHash,
    DeleteHash,

} from '../../services/index.js';


//! Generate Hash
const generateSHAHandler = async (req, res) => {
    // รับข้อมูลจากคำขอ (req.body)
    const { title, data_hash } = req.body;
    const result = await GenerateSHA(title, data_hash);

    // ส่ง HTTP response โดยใช้ผลลัพธ์ที่ได้จาก GenerateSHA
    return res.status(200).json(result);
};


const GenerateHandler = async (req, res) => {
    try {
        const { title, data_hash } = req.body;
        const result = await Generate(title, data_hash);
        
        // ส่ง HTTP response ด้วย status code 200 และผลลัพธ์จาก Generate
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



const getData_genHandler = async (req, res) => {
    const result = await getData_gen();

    if (result.error) {
        return res.status(500).json({ error: result.error });
    }

    return res.status(200).json(result);
};


const getByHashHandler = async (req, res) => {
    const { encrypt_hash } = req.body;
    const result = await getByHash(encrypt_hash);

    if (result.error) {
        if (result.error === 'Hash not found') {
            return res.status(404).json({ error: result.error });
        }
        return res.status(400).json({ error: result.error });
    }

    return res.status(200).json(result);
};


//!DecryptHash
const DecryptHashHandler = async (req, res) => {
    const { encrypt_hash, key, iv } = req.body;
    const result = await DecryptHash(encrypt_hash, key, iv);

    if (result.error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code ที่เหมาะสม
        return res.status(400).json({ error: result.error });
    }

    // ส่งผลลัพธ์ที่ถอดรหัสได้
    return res.status(200).json(result);
};


const DeleteHashHandler = async (req, res) => {
    const { id_gen } = req.body;
    const result = await DeleteHash(id_gen);

    if (result.error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code ที่เหมาะสม
        return res.status(400).json({ error: result.error });
    }

    // ส่งผลลัพธ์ที่ลบได้
    return res.status(200).json({ message: 'Delete Hash successful', data: result });
};


const UPDateHashHandler = async (req, res) => {
    // รับข้อมูลจาก req.body
    const { id_gen, title, data_hash } = req.body;

    try {
        // เรียกฟังก์ชัน UPDateHash พร้อมพารามิเตอร์ที่ต้องการ
        const updatedData = await UPDateHash(id_gen, title, data_hash);

        // ส่ง HTTP status code 200 พร้อมข้อมูลที่อัพเดทแล้ว
        return res.status(200).json({ message: 'Update Hash successful', data: updatedData });
    } catch (error) {
        // หากเกิดข้อผิดพลาด ส่ง HTTP status code 400 พร้อมข้อความข้อผิดพลาด
        return res.status(400).json({ error: error.message });
    }
};

export {
    GenerateHandler,
    generateSHAHandler,
    getData_genHandler,
    getByHashHandler,
    DecryptHashHandler,
    UPDateHashHandler,
    DeleteHashHandler,
}