import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// const Transaction_transfer_data = async ( id_transaction, amount_transaction, date_time, Payee ) => {
//     try {
//         // ตรวจสอบอินพุต
//         if (!id_transaction) {
//             return { error: 'id_transaction is required' };
//         }

//         const byID = await prisma.transaction.findUnique({
//             where: {
//                 id_transaction: id_transaction,
//             },
//         });

//         // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
//         if (!byID) {
//             return { error: 'transaction not found' };
//         }

//         if (!amount_transaction || !date_time || !Payee ) {
//             return { error: 'All data are required' };
//         }

//         // กำหนด key และ iv
//         const key = crypto.randomBytes(32);
//         const iv = crypto.randomBytes(16);

//         // สร้างตัวเข้ารหัส
//         const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

//         // รวมข้อมูลเป็น JSON string
//         const combinedData = JSON.stringify({ amount_transaction, date_time, Payee });

//         // เข้ารหัสข้อมูล
//         let encrypted = cipher.update(combinedData, 'utf8', 'hex');
//         encrypted += cipher.final('hex');

//         // อัปเดตข้อมูลในฐานข้อมูล
//         const updatedTransaction = await prisma.transaction.update({
//             where: {
//                 id_transaction: id_transaction,
//             },
//             data: {
//                 encryptHash: encrypted,
//                 key: key.toString('hex'),
//                 iv: iv.toString('hex'),
//             },
//         });

//         const createdTransactionHistory = await prisma.transactionHistory.create({
//             data: {
//                 id_transaction: id_transaction,
//                 amount_transaction: amount_transaction,
//                 date_time: date_time,
//                 Payee: Payee,
//             },
//         })

//         // ถอดรหัสข้อมูล
//         const decryptedData = await DecryptHash(updatedTransaction.encryptHash, updatedTransaction.key, updatedTransaction.iv);

//         // คืนค่าผลลัพธ์
//         return {
//             decryptedData,
//             Status_update: 'SUCCESS',
//         };

//     } catch (err) {
//         console.error('Transaction transfer error:', err);
//         throw err;
//     } finally {
//         // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
//         await prisma.$disconnect();
//     }
// };

const Transaction_transfer_data = async (id_transaction, amount, destinationAccount, type, namebankdestination,) => {
    try {

        // ตรวจสอบอินพุต
        if (!id_transaction) {
            return { error: 'id_transaction is required' };
        }

        const byID = await prisma.transaction.findUnique({
            where: {
                id_transaction: id_transaction,
            },
        });

        // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
        if (!byID) {
            return { error: 'transaction not found' };
        }

        if (!amount) {
            return { error: 'amount are required' };
        }

        if (type === "withdraw") {
            if (byID.amount < amount) {
                return { error: 'The total amount is not enough.' };
            }
            const byAmount = byID.amount - amount;

            // อัปเดตข้อมูลในฐานข้อมูล
            const updatedTransaction = await prisma.transaction.update({
                where: {
                    id_transaction: id_transaction,
                },
                data: {
                    amount: byAmount,
                },
            });

            const createdTransactionHistory = await prisma.transactionHistory.create({
                data: {
                    id_transaction: id_transaction,
                    amount: amount,
                    timestamp: new Date(Date.now()), // ใช้ Date.now() เพื่อรับค่าวันที่และเวลาปัจจุบัน
                    namebankdestination: namebankdestination,
                    destinationAccount: destinationAccount,
                    type: type,
                },
            })

            return {
                updatedTransaction,
                createdTransactionHistory,
                Status_update: 'SUCCESS',
            };


        } else if (type === "deposit") {
            const byAmount = byID.amount + amount;

            // อัปเดตข้อมูลในฐานข้อมูล
            const updatedTransaction = await prisma.transaction.update({
                where: {
                    id_transaction: id_transaction,
                },
                data: {
                    amount: byAmount,
                },
            });

            const createdTransactionHistory = await prisma.transactionHistory.create({
                data: {
                    id_transaction: id_transaction,
                    amount: amount,
                    timestamp: new Date(Date.now()), // ใช้ Date.now() เพื่อรับค่าวันที่และเวลาปัจจุบัน
                    namebankdestination: namebankdestination,
                    destinationAccount: destinationAccount,
                    type: type,
                },
            })

            return {
                updatedTransaction,
                createdTransactionHistory,
                Status_update: 'SUCCESS',
            };

        } else if (type === "transfer") {
            if (byID.amount < amount) {
                return { error: 'The total amount is not enough.' };
            }
            if ( !namebankdestination || !destinationAccount ) {
                return { error: 'Complete information is not available to record transaction history.' };
            }
            const byAmount = byID.amount - amount;

            // อัปเดตข้อมูลในฐานข้อมูล
            const updatedTransaction = await prisma.transaction.update({
                where: {
                    id_transaction: id_transaction,
                },
                data: {
                    amount: byAmount,
                },
            });

            const createdTransactionHistory = await prisma.transactionHistory.create({
                data: {
                    id_transaction: id_transaction,
                    amount: amount,
                    timestamp: new Date(Date.now()), // ใช้ Date.now() เพื่อรับค่าวันที่และเวลาปัจจุบัน
                    namebankdestination: namebankdestination,
                    destinationAccount: destinationAccount,
                    type: type,
                },
            })

            return {
                updatedTransaction,
                createdTransactionHistory,
                Status_update: 'SUCCESS',
            };

        } else {
            return { error: 'The type is incorrect according to the conditions.', };
        }

        // // อัปเดตข้อมูลในฐานข้อมูล
        // const updatedTransaction = await prisma.transaction.update({
        //     where: {
        //         id_transaction: id_transaction,
        //     },
        //     data: {
        //         amount: byAmount,
        //     },
        // });

        // const createdTransactionHistory = await prisma.transactionHistory.create({
        //     data: {
        //         id_transaction: id_transaction,
        //         amount: amount,
        //         date_time: date_time,
        //         payee: payee,
        //     },
        // })

    } catch (err) {
        console.error('Transaction transfer error:', err);
        throw err;
    } finally {
        // ปิดการเชื่อมต่อกับฐานข้อมูลเมื่อดำเนินการเสร็จสิ้น
        await prisma.$disconnect();
    }
};

export {
    Transaction_transfer_data,
}