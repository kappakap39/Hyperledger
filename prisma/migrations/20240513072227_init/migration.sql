-- CreateTable
CREATE TABLE "Generate" (
    "id_gen" UUID NOT NULL,
    "title" TEXT,
    "data_hash" TEXT[],
    "encrypt_hash" TEXT,
    "key" TEXT,
    "iv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generate_pkey" PRIMARY KEY ("id_gen")
);

-- CreateTable
CREATE TABLE "UserData" (
    "id_user" UUID NOT NULL,
    "encryptHash" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserData_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id_transaction" UUID NOT NULL,
    "namebank" TEXT NOT NULL,
    "sourceAccount" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "currency" TEXT DEFAULT 'THB',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_user" UUID NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id_transaction")
);

-- CreateTable
CREATE TABLE "TransactionHistory" (
    "id_history" UUID NOT NULL,
    "destinationAccount" TEXT,
    "namebankdestination" TEXT,
    "currency" TEXT DEFAULT 'THB',
    "type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id_transaction" UUID NOT NULL,

    CONSTRAINT "TransactionHistory_pkey" PRIMARY KEY ("id_history")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "UserData"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionHistory" ADD CONSTRAINT "TransactionHistory_id_transaction_fkey" FOREIGN KEY ("id_transaction") REFERENCES "Transaction"("id_transaction") ON DELETE RESTRICT ON UPDATE CASCADE;
