<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->text('description')->nullable();
            $table->json('nav_links')->nullable();     // [{label, url}]
            $table->json('social_media')->nullable();  // [{platform, url, icon}]
            $table->json('legal_links')->nullable();   // [{label, url}]
            $table->string('copyright_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
