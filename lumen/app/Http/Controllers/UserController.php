<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\LogService;
use App\Services\UserService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Class UserController
 *
 * @property UserService $service
 *
 * @package App\Http\Controllers
 */
class UserController extends Controller
{
    /** @var UserService */
    protected UserService $service;

    /**
     * LoginController constructor.
     */
    public function __construct()
    {
        $this->service = new UserService();
    }

    /**
     * Get logged user
     *
     * @return JsonResponse
     */
    public function getLoggedUser(): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            $userData = $this->service->generateLoginData($user);

            return $this->successResponse($userData);
        } catch (Throwable $e) {
            Log::error(LogService::getThrowableTraceAsString($e));

            return $this->errorResponse();
        }
    }
}
