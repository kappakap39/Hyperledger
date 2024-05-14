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
    namebank,
    sourceAccount,
    amount,

) => {
    try {
        // ตรวจสอบข้อมูล title และ data_hash
        if (!username || !fristname || !lastname || !id_gard || !tel || !address || !Array.isArray(address)|| !sourceAccount || !namebank) {
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
        const newEntry = await prisma.userData.create({
            data: {
                encryptHash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        const create_transaction = await prisma.transaction.create({
            data: {
                id_user: newEntry.id_user,
                namebank: namebank,
                sourceAccount: sourceAccount,
                amount: amount,
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
            encryptHash: newEntry.encryptHash,
            key: newEntry.key,
            iv: newEntry.iv,
            Status: newEntry.status,
            id_transaction: create_transaction.id_transaction,
            account_number: create_transaction.account_number,
            bank: create_transaction.bank,
            amount_transaction: create_transaction.amount,
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
        const data = await prisma.userData.findMany({});
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
            const byID = await prisma.userData.findUnique({
                where: {
                    id_user: id_user,
                },
            });

            // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
            if (!byID) {
                return { error: 'user not found' };
            }

            // รับค่าจากข้อมูลที่พบ
            const encryptHash = byID.encryptHash;
            const key = byID.key;
            const iv = byID.iv;

            // ถอดรหัสข้อมูล
            const result = await DecryptHash(encryptHash, key, iv);

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
    firstname,
    lastname,
    id_gard,
    tel,
    address
) => {
    try {
        // ตรวจสอบอินพุต
        if (!id_user) {
            return { error: 'id_user is required' };
        }

        const byID = await prisma.userData.findUnique({
            where: {
                id_user: id_user,
            },
        });

        // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
        if (!byID) {
            return { error: 'user not found' };
        }

        if (!username || !firstname || !lastname || !id_gard || !tel || !address || !Array.isArray(address)) {
            return { error: 'All data are required, and address must be an array' };
        }

        // กำหนด key และ iv
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวมข้อมูลเป็น JSON string
        const combinedData = JSON.stringify({ username, firstname, lastname, id_gard, tel, address });

        // เข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // อัปเดตข้อมูลในฐานข้อมูล
        const updatedUserData = await prisma.userData.update({
            where: {
                id_user: id_user,
            },
            data: {
                encryptHash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // ถอดรหัสข้อมูล
        const decryptedData = await DecryptHash(updatedUserData.encryptHash, updatedUserData.key, updatedUserData.iv);

        // คืนค่าผลลัพธ์
        return {
            id_gen: updatedUserData.id_gen,
            username: decryptedData.username,
            firstname: decryptedData.firstname,
            lastname: decryptedData.lastname,
            id_gard: decryptedData.id_gard,
            tel: decryptedData.tel,
            address: decryptedData.address,
            encryptHash: updatedUserData.encryptHash,
            key: updatedUserData.key,
            iv: updatedUserData.iv,
            Status: updatedUserData.status,
            Status_update: 'SUCCESS',
        };

    } catch (error) {
        console.error('Error:', error);
        return { error: 'Internal Server Error' };
    } finally {
        // ปิดการเชื่อมต่อฐานข้อมูล
        await prisma.$disconnect();
    }
};

const delete_user_data = async (id_user) => {
    try {
        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!id_user) {
            return { error: 'id_user is required' };
        }

        // ลบข้อมูลในฐานข้อมูล โดยใช้ `id_user` เพื่อค้นหาข้อมูลที่ต้องการลบ
        const delete_user = await prisma.userData.delete({
            where: {
                id_user: id_user,
            },
        });

        // คืนค่าผลลัพธ์การลบข้อมูล
        return delete_user;
    } catch (err) {
        console.error('Delete failed:', err);
        return { error: 'Delete failed' };
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};

export {
    add_user_data,
    get_all_user_data,
    get_by_id_user_data,
    edit_user_data,
    delete_user_data,
}