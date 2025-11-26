-- CreateTable
CREATE TABLE "driving_logs" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "duration" INTEGER NOT NULL,
    "notes" TEXT,
    "weather" TEXT,
    "road_types" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "driving_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "driving_logs" ADD CONSTRAINT "driving_logs_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
