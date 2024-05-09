-- CreateTable
CREATE TABLE "User_data" (
    "id_user" UUID NOT NULL,
    "encrypt_hash" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_data_pkey" PRIMARY KEY ("id_user")
);
