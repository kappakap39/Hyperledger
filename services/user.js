import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import {
    DecryptHash,
} from '../services/index.js';
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
            Status: newEntry.status,
            Status_create: 'SUCCESS',
        };
    } catch (error) {
        // คืนค่าข้อผิดพลาด
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};

const get_all_user_data = async () => {
    try {
        const data = await prisma.user_data.findMany({});
        return { data };
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};


const get_by_id_user_data = async (id_user) => {
    try {
        if (id_user) {
            // ค้นหาผู้ใช้ตาม id_user
            const byID = await prisma.user_data.findUnique({
                where: {
                    id_user: id_user,
                },
            });

            // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
            if (!byID) {
                return { error: 'user not found' };
            }

            // รับค่าจากข้อมูลที่พบ
            const encrypt_hash = byID.encrypt_hash;
            const key = byID.key;
            const iv = byID.iv;

            // ถอดรหัสข้อมูล
            const result = await DecryptHash(encrypt_hash, key, iv);

            // ส่งคืนผลลัพธ์ในรูปแบบของออบเจ็กต์
            return { byID, result };
        } else {
            // หากไม่มี id_user ที่ระบุ ให้ส่งคืนข้อผิดพลาด
            return { error: 'by id not provided' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Internal Server Error' };
    } finally {
        // ปิดการเชื่อมต่อฐานข้อมูล
        await prisma.$disconnect();
    }
};


const edit_user_data = async (
    id_user,
    username,
    fristname,
    lastname,
    id_gard,
    tel,
    address,

) => {
    try {

        if (id_user) {

            // ตรวจสอบข้อมูล title และ data_hash
            if (!username || !fristname || !lastname || !id_gard || !tel || !address || !Array.isArray(address)) {
                return { error: 'all data are required, and address must be an array' };
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
            const newEntry = await prisma.user_data.update({
                where: {
                    id_user: id_user,
                },
                data: {
                    encrypt_hash: encrypted,
                    key: key.toString('hex'),
                    iv: iv.toString('hex'),
                },
            });

            // คืนค่าผลลัพธ์ที่บันทึกในฐานข้อมูล
            return {
                id_gen: newEntry.id_gen,
                username: username,
                fristname: fristname,
                lastname: lastname,
                id_gard: id_gard,
                tel: tel,
                address: address,
                encrypt_hash: newEntry.encrypt_hash,
                key: newEntry.key,
                iv: newEntry.iv,
                Status: newEntry.status,
                Status_update: 'SUCCESS',
            };

        } else {
            // หากไม่มี id_user ที่ระบุ ให้ส่งคืนข้อผิดพลาด
            return { error: 'by id not provided' };
        }

    } catch (error) {
        // คืนค่าข้อผิดพลาด
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};

export {
    add_user_data,
    get_all_user_data,
    get_by_id_user_data,
    edit_user_data,

}