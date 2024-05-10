# การสร้าง Prisma เพื่อใช้ในการติดต่อฐานข้อมูลจำลอง

## ขั้นตอนการสร้างโฟลเดอร์และไฟล์ที่จำเป็น

1. สร้างโฟลเดอร์ใหม่ชื่ออะไรก็ได้และสร้างไฟล์ `schema.prisma`:

    - **schema.prisma**: มีข้อมูลในไฟล์ดังนี้:
    ```prisma
    generator client {
        provider        = "prisma-client-js"
        previewFeatures = ["interactiveTransactions"]
    }

    datasource db {
        provider = "postgresql"
        url      = env("DATABASE_URL")
    }

    // ตัวอย่างโมเดลสำหรับสร้างตาราง
    model Generate {
        id_gen       String   @id @default(uuid()) @db.Uuid
        title        String?
        data_hash    String[] // กำหนด `data_hash` ให้เป็น list ที่ non-nullable
        encrypt_hash String?
        key          String?
        iv           String?
        CreatedAt    DateTime @default(now())
        UpdatedAt    DateTime @updatedAt
    }
    ```

## ข้อสำคัญ
- ก่อนเริ่มกระบวนการนี้ ต้องติดตั้ง Docker และ Docker Compose ให้เรียบร้อย
- หลังจากเริ่มกระบวนการนี้ ต้องติดตั้ง Prisma ด้วยคำสั่ง `npx prisma generate`
- จากนั้นให้สร้างโมเดลด้วยคำสั่ง `npx prisma migrate dev --name init`
- หลังจากกระบวนการนี้แนะนำให้ใช้เครื่องมือเช่น DBeaver เพื่อทำการทดสอบเชื่อมต่อฐานข้อมูล
