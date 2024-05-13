import { 
    Transaction_transfer_data,

} from '../../services/index.js';

const Transaction_transfer = async (req, res) => {
    const { id_transaction, amount, destinationAccount, type, namebankdestination } = req.body;
    const result = await Transaction_transfer_data( id_transaction, amount, destinationAccount, type, namebankdestination,  );

    if (result.error) {
        return res.status(400).json({ error: result.error });
    }

    // ส่งผลลัพธ์ที่ลบได้
    return res.status(200).json({ message: 'Transaction update success', "Transaction :": result });
};

export {
    Transaction_transfer,
}