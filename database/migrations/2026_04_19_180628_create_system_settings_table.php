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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            
            // General Settings
            $table->string('company_name')->nullable();
            $table->string('tagline')->nullable();
            $table->string('logo_light')->nullable();
            $table->string('logo_dark')->nullable();
            $table->string('favicon')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_whatsapp')->nullable();
            $table->text('office_address')->nullable();
            $table->text('gmaps_embed')->nullable();

            // Integration Settings
            $table->string('ga_id')->nullable();
            $table->string('fb_pixel')->nullable();
            $table->string('wa_api_link')->nullable();
            $table->string('webhook_url')->nullable();

            // Lead & Notification Settings
            $table->string('notify_email')->nullable();
            $table->boolean('enable_auto_reply')->default(false);
            $table->text('redirect_url')->nullable();
            $table->text('wa_auto_message')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
