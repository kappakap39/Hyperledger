import { 
    ethersCheckMoneyServer,
} from '../../server/index.js';

const ethersCheckMoney = async (req, res) => {
    try {
        // รับ account ที่ต้องการตรวจสอบจาก request body
        const { account } = req.body;

        // เรียกใช้ฟังก์ชัน ethersCheckMoneyServer เพื่อรับข้อมูลยอดเงินในแต่ละสกุลเงิน
        const { balanceEther, balanceUSD, balanceTHB } = await ethersCheckMoneyServer(account);

        // ส่ง response กลับไปยัง Postman พร้อมข้อมูลยอดเงินในแต่ละสกุลเงิน
        return res.status(200).json({
            message: 'Wallet balance retrieved successfully',
            account,
            balance: {
                eth: `${balanceEther} ETH`,
                usd: `${balanceUSD} USD`,
                thb: `${balanceTHB} THB`,
                library: 'Ethers',
            },
        });
    } catch (error) {
        console.error('Error in ethersCheckMoney:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};

export {
    ethersCheckMoney,
}