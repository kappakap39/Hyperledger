import { Gateway, Wallets } from 'fabric-network';
import { fileURLToPath } from 'url';
import path from 'path';
import httpMocks from 'node-mocks-http';  // ใช้ library สำหรับสร้าง req และ res จำลอง
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//! Generate Hash
const GenerateSHA = async (req, res) => {
    // รับข้อมูลจากคำขอ (req.body)
    const { title, data_hash } = req.body;

    // ตรวจสอบข้อมูล title และ data_hash
    if (!title || !data_hash) {
        return res.status(400).json({ error: 'Title and data_hash are required' });
    }

    // สร้างข้อมูลรวมจาก title และ data_hash เพื่อสร้างค่าแฮช
    const data = `${title}${JSON.stringify(data_hash)}`;

    // สร้างค่าแฮช SHA-256
    const hash = crypto.createHash('sha256');
    hash.update(data);
    const result = hash.digest('hex'); // รับค่าแฮชในรูปแบบของรหัสฐาน 16

    // ส่งผลลัพธ์สมมุติกลับเป็น JSON
    res.status(200).json({
        title: title,
        data_hash: data_hash,
        result: result,
        Status: "SUCCESS"
    });
};

const Generate = async (req, res) => {
    try {
        // รับข้อมูลจากคำขอ (req.body)
        const { title, data_hash } = req.body;

        // ตรวจสอบข้อมูล title และ data_hash
        if (!title || !data_hash || !Array.isArray(data_hash)) {
            return res.status(400).json({ error: 'Title and data_hash are required, and data_hash must be an array' });
        }

        // กำหนด key และ iv (initialization vector)
        const key = crypto.randomBytes(32); // เป็นคีย์สำหรับการเข้ารหัส  ควรมีความยาว 32 ไบต์สำหรับ AES-256
        const iv = crypto.randomBytes(16); // เสริมความปลอดภัยให้กับการเข้ารหัส ควรมีคว ามยาว 16 ไบต์สำหรับ AES-256

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวบรวมข้อมูล `title` และ `data_hash` เข้าด้วยกันเป็น JSON string
        const combinedData = JSON.stringify({ title, data_hash });

        // เข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // บันทึกข้อมูลลงตาราง `generate` ในฐานข้อมูล
        await prisma.generate.create({
            data: {
                title: title,
                data_hash: data_hash,
                encrypt_hash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // ส่งผลลัพธ์กลับเป็น JSON
        res.status(200).json({
            id_gen,
            title: title,
            data_hash: data_hash,
            encrypt_hash: encrypted,
            key: key.toString('hex'),
            iv: iv.toString('hex'),
            Status: "SUCCESS",
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};



const getdata_gen = async (req, res) => {
    try {
        const data = await prisma.generate.findMany({});
        return res.json({ data: data });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

const getByHash = async (req, res) => {
    try {
        const { encrypt_hash } = req.body;
        console.log('Hash: ' + encrypt_hash);
        if (encrypt_hash) {
            const ByHash = await prisma.generate.findFirst({
                where: {
                    encrypt_hash: encrypt_hash,
                },
            });
            if (!ByHash) {
                return res.status(404).json({ error: 'Hash not data' });
            }
            return res.json(ByHash);
        } else {
            return res.status(404).json({ error: 'body not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await prisma.$disconnect();
    }
};

//!DecryptHash
const DecryptHash = async (req, res) => {
    try {
        const { encrypt_hash, key, iv } = req.body;

        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!encrypt_hash || !key || !iv) {
            return res.status(400).json({ error: 'Hash data, key, and iv are required' });
        }

        // แปลง key และ iv จาก hex string เป็น buffer
        const keyBuffer = Buffer.from(key, 'hex');
        const ivBuffer = Buffer.from(iv, 'hex');

        // สร้างตัวถอดรหัส
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);

        // ถอดรหัสข้อมูล
        let decrypted = decipher.update(encrypt_hash, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // ส่งผลลัพธ์ที่ถอดรหัสแล้วเป็น JSON
        return res.json({ decrypted });
    } catch (err) {
        console.error('Decryption failed:', err);
        return res.status(400).json({ error: 'Decryption failed' });
    } finally {
        await prisma.$disconnect();
    }
};


const DeleteHash = async (req, res) => {
    try {
        // ดึงข้อมูลจาก request body
        const { id_gen } = req.body;

        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!id_gen) {
            return res.status(400).json({ error: 'id_gen is required' });
        }

        // อัพเดทข้อมูลในฐานข้อมูล โดยใช้ `id_gen` เพื่อค้นหาข้อมูลที่ต้องการปรับปรุง
        const deleteHash = await prisma.generate.delete({
            where: {
                id_gen: id_gen,
            },
        });

        // ส่งผลลัพธ์ที่ปรับปรุงแล้วเป็น JSON
        return res.json({ deleteHash });
    } catch (err) {
        console.error('delete Hash failed:', err);
        return res.status(400).json({ error: 'delete Hash failed' });
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};

const UPDateHash = async (req, res) => {
    try {
        // ดึงข้อมูลจาก request body
        const { id_gen, title, data_hash } = req.body;

        // ตรวจสอบข้อมูลที่ส่งเข้ามา
        if (!id_gen) {
            return res.status(400).json({ error: 'id_gen is required' });
        }
        if (!title || !data_hash || !Array.isArray(data_hash)) {
            return res.status(400).json({ error: 'Title and data_hash are required, and data_hash must be an array' });
        }

        // กำหนด key และ iv (initialization vector) สำหรับการเข้ารหัส
        const key = crypto.randomBytes(32); // ความยาว 32 ไบต์สำหรับ AES-256
        const iv = crypto.randomBytes(16); // ความยาว 16 ไบต์สำหรับ AES-256

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวมข้อมูล `title` และ `data_hash` เข้าด้วยกันเป็น JSON string
        const combinedData = JSON.stringify({ title, data_hash });

        // ทำการเข้ารหัสข้อมูล
        let encrypted = cipher.update(combinedData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // อัพเดทข้อมูลในฐานข้อมูล โดยใช้ `id_gen` เพื่อค้นหาข้อมูลที่ต้องการปรับปรุง
        const UPHash = await prisma.generate.update({
            where: {
                id_gen: id_gen,
            },
            data: {
                title: title,
                data_hash: data_hash,
                encrypt_hash: encrypted,
                key: key.toString('hex'),
                iv: iv.toString('hex'),
            },
        });

        // ส่งผลลัพธ์ที่ปรับปรุงแล้วเป็น JSON
        return res.json({ UPHash });
    } catch (err) {
        console.error('Update failed:', err);
        return res.status(400).json({ error: 'Update failed' });
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};

// const Generate = async (req, res) => {
//     // รับข้อมูลจากคำขอ (req.body)
//     const { title, data_hash } = req.body;

//     // ตรวจสอบข้อมูล title และ data_hash
//     if (!title || !data_hash) {
//         return res.status(400).json({ error: 'Title and data_hash are required' });
//     }

//     // สร้างข้อมูลรวมจาก title และ data_hash เพื่อสร้างค่าแฮช
//     const data = `${title}${JSON.stringify(data_hash)}`;

//     // สร้างค่าแฮช SHA-256
//     const hash = crypto.createHash('sha256');
//     hash.update(data);
//     const result = hash.digest('hex'); // รับค่าแฮชในรูปแบบของรหัสฐาน 16

//     // กำหนด path ไปยังไฟล์ connection profile และ directory ของ wallet
//     const ccpPath = path.resolve(__dirname, '..', 'connection.json');
//     const walletPath = path.resolve(__dirname, '..', 'wallet');

//     try {
//         // สร้าง Gateway และเชื่อมต่อกับเครือข่าย
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         const gateway = new Gateway();
//         await gateway.connect(ccpPath, {
//             wallet,
//             identity: 'Org1User1', // ระบุตัวตนที่คุณต้องการใช้
//             discovery: { enabled: true, asLocalhost: true } // ตั้งค่าการค้นพบ peer
//         });

//         // รับสัญญา (contract) ที่คุณต้องการใช้งาน
//         const network = await gateway.getNetwork('mychannel'); // กำหนดช่องที่คุณต้องการเชื่อมต่อ
//         const contract = network.getContract('mychaincode'); // กำหนดชื่อของ chaincode ที่คุณต้องการใช้

//         // เรียกใช้ฟังก์ชันใน chaincode
//         const transactionResult = await contract.submitTransaction('generateHash', title, data_hash);

//         // ส่งผลลัพธ์กลับ
//         const mockResponse = {
//             title,
//             data_hash,
//             result,
//             transactionResult: transactionResult.toString() // ส่งผลลัพธ์ของธุรกรรมจาก chaincode
//         };

//         // ปิด gateway เมื่อเสร็จสิ้นการทำงาน
//         await gateway.disconnect();

//         // ส่งผลลัพธ์เป็น JSON
//         res.status(200).json(mockResponse);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to execute transaction' });
//     }
// };


// สร้าง __dirname จาก import.meta.url
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const Generate = async (req, res) => {
//     try {
//         // รับข้อมูลจากคำขอ (req.body)
//         const { title, data_hash } = req.body;

//         // ตรวจสอบข้อมูล title และ data_hash
//         if (!title || !data_hash) {
//             return res.status(400).json({ error: 'Title and data_hash are required' });
//         }

//         // สร้างข้อมูลรวมจาก title และ data_hash เพื่อสร้างค่าแฮช
//         const data = `${title}${JSON.stringify(data_hash)}`;

//         // สร้างค่าแฮช SHA-256
//         const hash = crypto.createHash('sha256');
//         hash.update(data);
//         const result = hash.digest('hex'); // รับค่าแฮชในรูปแบบของรหัสฐาน 16

//         // กำหนด path ไปยังไฟล์ connection profile และ directory ของ wallet
//         const ccpPath = path.resolve(__dirname, '..', 'connection.json');
//         const walletPath = path.resolve(__dirname, '..', 'wallet');

//         // สร้าง Wallet
//         let wallet;
//         try {
//             wallet = await Wallets.newFileSystemWallet(walletPath);
//         } catch (error) {
//             console.error('Failed to create wallet:', error);
//             return res.status(500).json({ error: 'Failed to create wallet' });
//         }

//         // สร้าง Gateway และเชื่อมต่อกับเครือข่าย
//         const gateway = new Gateway();
//         try {
//             await gateway.connect(ccpPath, {
//                 wallet,
//                 identity: 'Org1User1', // ระบุตัวตนที่คุณต้องการใช้
//                 discovery: { enabled: true, asLocalhost: true } // ตั้งค่าการค้นพบ peer
//             });
//         } catch (error) {
//             console.error('Failed to connect to gateway:', error);
//             return res.status(500).json({ error: 'Failed to connect to gateway' });
//         }

//         // รับสัญญา (contract) ที่คุณต้องการใช้งาน
//         let contract;
//         try {
//             const network = await gateway.getNetwork('mychannel'); // กำหนดช่องที่คุณต้องการเชื่อมต่อ
//             contract = network.getContract('mychaincode'); // กำหนดชื่อของ chaincode ที่คุณต้องการใช้
//         } catch (error) {
//             console.error('Failed to get contract:', error);
//             return res.status(500).json({ error: 'Failed to get contract' });
//         }

//         // เรียกใช้ฟังก์ชันใน chaincode
//         let transactionResult;
//         try {
//             transactionResult = await contract.submitTransaction('generateHash', title, data_hash);
//         } catch (error) {
//             console.error('Failed to submit transaction:', error);
//             return res.status(500).json({ error: 'Failed to submit transaction' });
//         }

//         // ส่งผลลัพธ์กลับ
//         const mockResponse = {
//             title,
//             data_hash,
//             result,
//             transactionResult: transactionResult.toString() // ส่งผลลัพธ์ของธุรกรรมจาก chaincode
//         };

//         // ปิด gateway เมื่อเสร็จสิ้นการทำงาน
//         await gateway.disconnect();

//         // ส่งผลลัพธ์เป็น JSON
//         res.status(200).json(mockResponse);
//     } catch (error) {
//         // ดักจับข้อผิดพลาดทั่วไป
//         console.error('Unexpected error:', error);
//         res.status(500).json({ error: 'Unexpected error occurred', details: error });
//     }
// };


export {
    Generate,
    GenerateSHA,
    getdata_gen,
    getByHash,
    DecryptHash,
    UPDateHash,
    DeleteHash,
}