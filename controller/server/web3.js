import { 
    web3_check_money_server,
} from '../../server/index.js';

const web3_check_money = async (req, res) => {
    try {
        // สมมติว่าคุณมี account ที่ต้องการตรวจสอบจาก request body
        const { account } = req.body;

        // เรียกใช้ฟังก์ชัน web3_check_money_server เพื่อรับข้อมูลยอดเงินในแต่ละสกุลเงิน
        const { balanceEther, balanceUSD, balanceTHB } = await web3_check_money_server(account);

        // ส่ง response กลับไปยัง Postman พร้อมข้อมูลยอดเงินในแต่ละสกุลเงิน
        return res.status(200).json({
            message: 'Wallet balance retrieved successfully',
            account,
            balance: {
                eth: `${balanceEther} ETH`,
                usd: `${balanceUSD} USD`,
                thb: `${balanceTHB} THB`,
                "library": "Web3"
            }
        });
    } catch (error) {
        console.error('Error in connect_wallet:', error);
        return res.status(500).json({ error: 'An error occurred' });
    }
};


export {
    web3_check_money,
}