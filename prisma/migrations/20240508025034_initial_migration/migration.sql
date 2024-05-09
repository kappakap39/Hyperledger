-- CreateTable
CREATE TABLE "Generate" (
    "id_gen" UUID NOT NULL,
    "title" TEXT,
    "data_hash" TEXT[],
    "Hash" TEXT,
    "key" TEXT,
    "iv" TEXT,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Generate_pkey" PRIMARY KEY ("id_gen")
);
