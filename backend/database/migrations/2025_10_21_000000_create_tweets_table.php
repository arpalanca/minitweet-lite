<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
	public function up(): void
	{
		Schema::create('tweets', function (Blueprint $table): void {
			$table->id();
			$table->foreignId('user_id')->constrained()->cascadeOnDelete();
			$table->string('body', 280);
			$table->timestamps();
		});
	}

	public function down(): void
	{
		Schema::dropIfExists('tweets');
	}
};


