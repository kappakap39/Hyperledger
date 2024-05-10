import { 
    connect_wallet_data,

} from '../../services/index.js';

const connect_wallet = async (req, res) => {
    const {  } = req.body;
    const result = await connect_wallet_data();

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    // ส่งผลลัพธ์ที่ลบได้
    return res.status(200).json({ message: '', "wallet crypto :": result });
};

export {
    connect_wallet,
}