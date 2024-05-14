import { ethers } from 'ethers';
import fetch from 'node-fetch';

// const infuraProjectId = 'e8934ca3811a4b8c84330c9c61c494fa';
// const infuraUrl = `https://mainnet.infura.io/v3/${infuraProjectId}`;

// // สร้าง provider สำหรับเชื่อมต่อกับเครือข่าย Ethereum ผ่าน Infura
// const provider = new ethers.providers.JsonRpcProvider(infuraUrl);

// const ethersCheckMoneyServer = async (account) => {
//     try {
//         // ตรวจสอบยอดเงินในบัญชีที่กำหนด
//         const balanceWei = await provider.getBalance(account);
//         const balanceEther = ethers.utils.formatEther(balanceWei);
        
//         // ดึงข้อมูลอัตราแลกเปลี่ยนจาก CoinGecko API
//         const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,thb');
//         const data = await response.json();

//         // รับอัตราแลกเปลี่ยนในหน่วย USD และ THB
//         const etherToUSD = data.ethereum.usd;
//         const etherToTHB = data.ethereum.thb;

//         // คำนวณยอดเงินในหน่วย USD และ THB
//         const balanceUSD = balanceEther * etherToUSD;
//         const balanceTHB = balanceEther * etherToTHB;

//         // ส่งผลลัพธ์เป็น JSON ที่ประกอบด้วยยอดเงินในหน่วย Ether, USD และ THB
//         return {
//             balanceEther,
//             balanceUSD,
//             balanceTHB,
//         };
//     } catch (err) {
//         console.error('Error checking balance:', err);
//         throw err;
//     }
// };

const ethersCheckMoneyServer = async (account) => {
    try {
        // สร้าง provider ใหม่ด้วย JsonRpcProvider
        const provider = new ethers.providers.JsonRpcProvider("https://mainnet.infura.io/v3/e8934ca3811a4b8c84330c9c61c494fa");
        
        // ตรวจสอบยอดเงินในบัญชีที่กำหนด
        const balanceWei = await provider.getBalance(account);
        const balanceEther = ethers.utils.formatEther(balanceWei);
        
        // ดึงข้อมูลอัตราแลกเปลี่ยนจาก CoinGecko API
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,thb');
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
            balanceTHB,
        };
    } catch (err) {
        console.error('Error checking balance:', err);
        throw err;
    }
};

export {
    ethersCheckMoneyServer,
}