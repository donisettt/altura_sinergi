<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Public API routes will go here (e.g. health check)
    Route::get('/health', fn () => response()->json(['status' => 'ok', 'version' => '1.0.0']));
});
