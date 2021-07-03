<?php

/** @var Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

use Laravel\Lumen\Routing\Router;

$router->get('/', function () use ($router) {
    return $router->app->version();
});

$router->post('/login', ['uses' => 'LoginController@login']);
$router->post('/login-token', ['uses' => 'LoginController@loginWithRememberToken']);

/** Routes with auth */
$router->group(['middleware' => ['auth']], function () use ($router) {

    $router->group(['prefix' => 'user'], function () use ($router) {
        $router->get('', ['uses' => 'UserController@getLoggedUser']);
        $router->patch('', ['uses' => 'UserController@updateLoggedUser']);
    });

    $router->post('/logout', ['uses' => 'LoginController@logout']);

    $router->get('/boards', ['uses' => 'BoardController@all']);
});