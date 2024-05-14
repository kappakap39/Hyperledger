import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import Web3 from 'web3';
// กำหนด URL ของ Ethereum network ผ่าน Infura โดยใช้ API Key ของคุณ
const infuraUrl = 'https://mainnet.infura.io/v3/e8934ca3811a4b8c84330c9c61c494fa';
// 0xDe7a779e1C12F8deCec0f2e7bbC5F85A5E804f8C //Metamark for account
// สร้าง Web3 instance
const web3 = new Web3(infuraUrl);

import fetch from 'node-fetch';

//! ฟังก์ชันตรวจสอบยอดเงินในบัญชี Ethereum wallet
// const web3_check_money_server = async (account) => {
//     try {
//         // ตรวจสอบยอดเงินในบัญชีที่กำหนด
//         const balanceWei = await web3.eth.getBalance(account);
//         const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        
//         // แสดงยอดเงินที่แปลงเป็นหน่วย Ether
//         console.log(`Balance in account ${account}:`, balanceEther, 'ETH');

//         // กลับค่าทางฟังก์ชันเป็น balance ในหน่วย Ether
//         return balanceEther;
//     } catch (err) {
//         console.error('Error checking balance:', err);
//         throw err;
//     } finally {
//         // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
//         await prisma.$disconnect();
//     }
// };

//! ฟังก์ชันตรวจสอบยอดเงินในบัญชี Ethereum wallet และคำนวณยอดเงินในหน่วย USD และ THB
const web3_check_money_server = async (account) => {
    try {
        // ตรวจสอบยอดเงินในบัญชีที่กำหนด
        const balanceWei = await web3.eth.getBalance(account);
        const balanceEther = web3.utils.fromWei(balanceWei, 'ether');
        
        // แสดงยอดเงินที่แปลงเป็นหน่วย Ether
        console.log(`Balance in account ${account}: ${balanceEther} ETH`);

        // ดึงข้อมูลอัตราแลกเปลี่ยนจาก CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,thb,eth,btc');
        const data = await response.json();

        // รับอัตราแลกเปลี่ยนในหน่วย USD และ THB
        const etherToUSD = data.ethereum.usd;
        const etherToTHB = data.ethereum.thb;

        // คำนวณยอดเงินในหน่วย USD และ THB
        const balanceUSD = balanceEther * etherToUSD;
        const balanceTHB = balanceEther * etherToTHB;

        // ส่งผลลัพธ์เป็น JSON ที่ประกอบด้วยยอดเงินในหน่วย Ether, USD และ THB
        return {
            balanceEther,
            balanceUSD,
            balanceTHB
        };
    } catch (err) {
        console.error('Error checking balance:', err);
        throw err;
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};


export {
    web3_check_money_server,
};
