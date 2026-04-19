<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_settings', function (Blueprint $table) {
            $table->id();
            $table->json('headline')->nullable();           // rich text JSON (Tiptap)
            $table->string('subheadline')->nullable();
            $table->string('tagline')->nullable();
            $table->string('cta1_text')->nullable();
            $table->string('cta1_link')->nullable();
            $table->string('cta2_text')->nullable();
            $table->string('cta2_link')->nullable();
            $table->string('background_image')->nullable(); // path lokal storage/public
            $table->boolean('use_gradient')->default(true);
            $table->boolean('use_animation')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_settings');
    }
};
