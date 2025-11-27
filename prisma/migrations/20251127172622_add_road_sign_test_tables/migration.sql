-- CreateTable
CREATE TABLE "road_sign_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "road_sign_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "road_signs" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "sign_name" TEXT NOT NULL,
    "sign_meaning" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "color_scheme" TEXT NOT NULL,
    "image_url" TEXT,
    "additional_notes" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "road_signs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "road_sign_test_attempts" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_questions" INTEGER NOT NULL,
    "correct_answers" INTEGER NOT NULL,
    "percentage" DOUBLE PRECISION,
    "passed" BOOLEAN,
    "time_taken" INTEGER,
    "test_mode" TEXT NOT NULL DEFAULT 'all',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "road_sign_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "road_sign_test_answers" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "sign_id" TEXT NOT NULL,
    "selected_answer" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "time_spent" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "road_sign_test_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "road_signs" ADD CONSTRAINT "road_signs_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "road_sign_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "road_sign_test_attempts" ADD CONSTRAINT "road_sign_test_attempts_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "road_sign_test_answers" ADD CONSTRAINT "road_sign_test_answers_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "road_sign_test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "road_sign_test_answers" ADD CONSTRAINT "road_sign_test_answers_sign_id_fkey" FOREIGN KEY ("sign_id") REFERENCES "road_signs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
