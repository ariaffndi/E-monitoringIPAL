<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('water_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('operational_report_id')->constrained()->cascadeOnDelete();
            $table->foreignId('water_parameter_id')->constrained()->cascadeOnDelete();
            $table->enum('location',['inlet', 'outlet'])->nullable();
            $table->decimal('value', 10, 2);
            $table->string('test_image')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('water_tests');
    }
};
