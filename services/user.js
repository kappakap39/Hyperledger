import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const add_user_data = async (
    username,
    fristname,
    lastname,
    id_gard,
    tel,
    address,
    
) => {
    try {
        // ตรวจสอบข้อมูล title และ data_hash
        if (!username || !fristname || !lastname || !id_gard || !tel || !address || !Array.isArray(address)) {
            return { error: 'add all data are required, and address must be an array' };
        }

        // กำหนด key และ iv (initialization vector)
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวบรวมข้อมูล เข้าด้วยกันเป็น JSON string
        const combinedData = JSON.stringify({ username, fristname, lastname, id_gard, tel, address });

        // เข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // บันทึกข้อมูลลงตาราง `User_data` ในฐานข้อมูล
        const newEntry = await prisma.user_data.create({
            data: {
                encrypt_hash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // คืนค่าผลลัพธ์ที่บันทึกในฐานข้อมูล
        return {
            id_gen: newEntry.id_gen,
            // fristname: username,
            // fristname: fristname,
            // lastname: lastname,
            // id_gard: id_gard,
            // tel: tel,
            // address: address,
            encrypt_hash: newEntry.encrypt_hash,
            key: newEntry.key,
            iv: newEntry.iv,
            status: 'SUCCESS',
        };
    } catch (error) {
        // คืนค่าข้อผิดพลาด
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};



export {
    add_user_data,

}