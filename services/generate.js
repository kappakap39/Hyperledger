import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//! Generate Hash
const GenerateSHA = async (title, data_hash) => {
    // ตรวจสอบข้อมูล title และ data_hash
    if (!title || !data_hash) {
        return { error: 'Title and data_hash are required' };
    }

    // สร้างข้อมูลรวมจาก title และ data_hash เพื่อสร้างค่าแฮช
    const data = `${title}${JSON.stringify(data_hash)}`;

    // สร้างค่าแฮช SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const result = hash.digest('hex'); // รับค่าแฮชในรูปแบบของรหัสฐาน 16

    return {
        title,
        data_hash,
        result,
        status: 'SUCCESS',
    };
};

const Generate = async (title, data_hash) => {
    try {
        // ตรวจสอบข้อมูล title และ data_hash
        if (!title || !data_hash || !Array.isArray(data_hash)) {
            return { error: 'Title and data_hash are required, and data_hash must be an array' };
        }

        // กำหนด key และ iv (initialization vector)
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวบรวมข้อมูล `title` และ `data_hash` เข้าด้วยกันเป็น JSON string
        const combinedData = JSON.stringify({ title, data_hash });

        // เข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // บันทึกข้อมูลลงตาราง `generate` ในฐานข้อมูล
        const newEntry = await prisma.generate.create({
            data: {
                title: title,
                data_hash: data_hash,
                encrypt_hash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // คืนค่าผลลัพธ์ที่บันทึกในฐานข้อมูล
        return {
            id_gen: newEntry.id_gen,
            title: newEntry.title,
            data_hash: newEntry.data_hash,
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

const getdata_gen = async () => {
    try {
        const data = await prisma.generate.findMany({});
        return { data };
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};


const getByHash = async (encrypt_hash) => {
    try {
        if (encrypt_hash) {
            const byHash = await prisma.generate.findFirst({
                where: {
                    encrypt_hash: encrypt_hash,
                },
            });

            if (!byHash) {
                return { error: 'Hash not found' };
            }
            return byHash;
        } else {
            return { error: 'Encrypt hash not provided' };
        }
    } catch (error) {
        console.error('Error:', error);
        return { error: 'Internal Server Error' };
    } finally {
        await prisma.$disconnect();
    }
};


//!DecryptHash
const DecryptHash = async (encrypt_hash, key, iv) => {
    try {
        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!encrypt_hash || !key || !iv) {
            return { error: 'Hash data, key, and iv are required' };
        }

        // แปลง key และ iv จาก hex string เป็น buffer
        const keyBuffer = Buffer.from(key, 'hex');
        const ivBuffer = Buffer.from(iv, 'hex');

        // สร้างตัวถอดรหัส
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

        // ถอดรหัสข้อมูล
        let decrypted = decipher.update(encrypt_hash, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // แปลงข้อมูลที่ถอดรหัสเป็นวัตถุ JSON
        const data = JSON.parse(decrypted);

        // คืนค่าผลลัพธ์ที่ถอดรหัสและแปลง JSON แล้ว
        return data;
    } catch (err) {
        console.error('Decryption failed:', err);
        return { error: 'Decryption failed' };
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูล
        await prisma.$disconnect();
    }
};




const DeleteHash = async (id_gen) => {
    try {
        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!id_gen) {
            return { error: 'id_gen is required' };
        }

        // ลบข้อมูลในฐานข้อมูล โดยใช้ `id_gen` เพื่อค้นหาข้อมูลที่ต้องการลบ
        const deleteHash = await prisma.generate.delete({
            where: {
                id_gen: id_gen,
            },
        });

        // คืนค่าผลลัพธ์การลบข้อมูล
        return deleteHash;
    } catch (err) {
        console.error('Delete Hash failed:', err);
        return { error: 'Delete Hash failed' };
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};


const UPDateHash = async (id_gen, title, data_hash) => {
    try {
        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!id_gen) {
            throw new Error('id_gen is required');
        }
        if (!title || !data_hash || !Array.isArray(data_hash)) {
            throw new Error('Title and data_hash are required, and data_hash must be an array');
        }

        // กำหนด key และ iv (initialization vector) สำหรับการเข้ารหัส
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวมข้อมูล `title` และ `data_hash` เข้าด้วยกันเป็น JSON string
        const combinedData = JSON.stringify({ title, data_hash });

        // ทำการเข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // อัพเดทข้อมูลในฐานข้อมูลโดยใช้ `id_gen`
        const UPHash = await prisma.generate.update({
            where: {
                id_gen,
            },
            data: {
                title,
                data_hash,
                encrypt_hash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // ส่งผลลัพธ์ข้อมูลที่อัพเดทแล้ว
        return UPHash;
    } catch (err) {
        console.error('Update failed:', err);
        throw err;
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};


export {
    GenerateSHA,
    Generate,
    getdata_gen,
    getByHash,
    DecryptHash,
    UPDateHash,
    DeleteHash,
}