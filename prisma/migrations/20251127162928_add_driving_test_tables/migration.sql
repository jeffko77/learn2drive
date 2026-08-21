-- CreateTable
CREATE TABLE "driving_test_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driving_test_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driving_test_criteria" (
    "id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "criteria_name" TEXT NOT NULL,
    "evaluation_guide" TEXT NOT NULL,
    "max_points" INTEGER NOT NULL DEFAULT 5,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driving_test_criteria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driving_test_attempts" (
    "id" TEXT NOT NULL,
    "driver_id" TEXT NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_score" INTEGER,
    "max_possible_score" INTEGER,
    "passed" BOOLEAN,
    "evaluator_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driving_test_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "driving_test_evaluations" (
    "id" TEXT NOT NULL,
    "attempt_id" TEXT NOT NULL,
    "criteria_id" TEXT NOT NULL,
    "points_deducted" INTEGER NOT NULL DEFAULT 0,
    "evaluator_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "driving_test_evaluations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "driving_test_criteria" ADD CONSTRAINT "driving_test_criteria_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "driving_test_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driving_test_attempts" ADD CONSTRAINT "driving_test_attempts_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driving_test_evaluations" ADD CONSTRAINT "driving_test_evaluations_attempt_id_fkey" FOREIGN KEY ("attempt_id") REFERENCES "driving_test_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driving_test_evaluations" ADD CONSTRAINT "driving_test_evaluations_criteria_id_fkey" FOREIGN KEY ("criteria_id") REFERENCES "driving_test_criteria"("id") ON DELETE CASCADE ON UPDATE CASCADE;
