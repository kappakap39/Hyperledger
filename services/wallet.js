import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const connect_wallet_data = async () => {
    try {
        const connect = "";
        return connect;
    } catch (err) {
        console.error('Connect Wallet to Blockchain:', err);
        throw err;
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};


export {
    connect_wallet_data,
}