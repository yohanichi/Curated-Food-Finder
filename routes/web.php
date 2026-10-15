<?php

use Illuminate\Support\Facades\Route;

// Catch-all route — serve the Vue SPA for every web request, excluding /api
Route::get('/{any?}', function () {
    return view('app');
})->where('any', '^(?!api).*$');
