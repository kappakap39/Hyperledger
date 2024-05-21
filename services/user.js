import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import {
    DecryptHash,
} from '../services/index.js';
const prisma = new PrismaClient();

import { Gateway, Wallets } from 'fabric-network';
import { resolve, join } from 'path';
import { readFileSync } from 'fs';


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
        if (!username || !fristname || !lastname || !id_gard || !tel || !address || !Array.isArray(address) || !sourceAccount || !namebank) {
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
            id_user: newEntry.id_user,
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
            sourceAccount: create_transaction.sourceAccount,
            namebank: create_transaction.namebank,
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

// const enrollUser = async (newEntry, create_transaction) => {
//     // ข้อมูลการลงทะเบียนจำลอง
//     return {
//         certificate: `-----BEGIN CERTIFICATE-----
// User encryptHash: ${JSON.stringify(newEntry.encryptHash)}
// User key: ${JSON.stringify(newEntry.key)}
// User iv: ${JSON.stringify(newEntry.iv)}
// Transaction id_transaction: ${JSON.stringify(create_transaction.id_transaction)}
// Transaction namebank: ${JSON.stringify(create_transaction.namebank)}
// Transaction sourceAccount: ${JSON.stringify(create_transaction.sourceAccount)}
// -----END CERTIFICATE-----`,
//         key: {
//             toBytes: function () {
//                 return Buffer.from('fakePrivateKeyBytes');
//             }
//         }
//     };
// };

const add_data_userWallets = async (
    username,
    firstname,
    lastname,
    id_card,
    tel,
    address,
    namebank,
    sourceAccount,
    amount
) => {
    try {
        // ตรวจสอบข้อมูล
        if (!username || !firstname || !lastname || !id_card || !tel || !address || !Array.isArray(address) || !sourceAccount || !namebank) {
            return { error: 'add all data are required, and address must be an array' };
        }

        // กำหนด key และ iv
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);

        // สร้างตัวเข้ารหัส
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

        // รวบรวมข้อมูลเป็น JSON string
        const combinedData = JSON.stringify({ username, firstname, lastname, id_card, tel, address });

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

        //! สร้างกระเป๋าเงินของผู้ใช้ใน Hyperledger Fabric
        // const walletPath = "../wallet/user";
        // const wallet = await Wallets.newFileSystemWallet(walletPath);
        // console.log(`Wallet path: ${walletPath}`);
        const walletPath = join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // ตรวจสอบว่ามีตัวตนของผู้ใช้อยู่ในกระเป๋าเงินหรือไม่
        const identityLabel = newEntry.id_user;
        const identity = await wallet.get(identityLabel);
        if (!identity) {
            console.log(`ไม่มีตัวตนของผู้ใช้ "${identityLabel}" อยู่ในกระเป๋าเงิน`);
            console.log(`พยายามลงทะเบียนผู้ใช้ "${identityLabel}"`);
            // ข้อมูลการลงทะเบียนจำลอง (สำหรับการทดสอบเท่านั้น)
            const enrollment = await enrollUser(newEntry, create_transaction);
            // สร้างตัวตนจากใบรับรองและกุญแจส่วนตัว
            const x509Identity = {
                credentials: {
                    certificate: enrollment.certificate,
                    privateKey: enrollment.key.toBytes(),
                },
                mspId: 'Org1MSP',
                type: 'X.509',
            };
            // เพิ่มตัวตนลงในกระเป๋าเงิน
            await wallet.put(identityLabel, x509Identity);
            console.log(`ลงทะเบียนผู้ใช้ "${identityLabel}" เข้าสู่กระเป๋าเงินเรียบร้อยแล้ว`);
        }

        // คืนค่าผลลัพธ์ที่บันทึกในฐานข้อมูล
        return {
            id_user: newEntry.id_user,
            encryptHash: newEntry.encryptHash,
            key: newEntry.key,
            iv: newEntry.iv,
            Status: newEntry.status,
            id_transaction: create_transaction.id_transaction,
            sourceAccount: create_transaction.sourceAccount,
            namebank: create_transaction.namebank,
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

// ฟังก์ชันสำหรับการลงทะเบียนผู้ใช้ (สำหรับการทดสอบเท่านั้น)
const enrollUser = async (newEntry, create_transaction) => {
    // ข้อมูลการลงทะเบียนจำลอง (คุณอาจเปลี่ยนส่วนนี้เป็นการเรียก CA แทน)
    return {
        certificate: `-----BEGIN CERTIFICATE-----
User encryptHash: ${newEntry.encryptHash}
User key: ${newEntry.key}
User iv: ${newEntry.iv}
Transaction id_transaction: ${create_transaction.id_transaction}
Transaction namebank: ${create_transaction.namebank}
Transaction sourceAccount: ${create_transaction.sourceAccount}
-----END CERTIFICATE-----`,
        key: {
            toBytes: function () {
                return Buffer.from('fakePrivateKeyBytes'); // ควรใช้กุญแจส่วนตัวที่ถูกต้องที่ได้จาก CA
            }
        }
    };
};


export {
    add_user_data,
    get_all_user_data,
    get_by_id_user_data,
    edit_user_data,
    delete_user_data,
    add_data_userWallets,
}