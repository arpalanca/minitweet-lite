<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TweetController;

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum'])->group(function (): void {
    Route::get('/tweets', [TweetController::class, 'index']);
    Route::post('/tweets', [TweetController::class, 'store']);
    Route::post('/tweets/{tweet}/like', [TweetController::class, 'like']);
    Route::delete('/tweets/{tweet}/like', [TweetController::class, 'unlike']);
});
