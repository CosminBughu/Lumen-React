<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserToken;
use App\Services\LogService;
use App\Services\UserService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

/**
 * Class LoginController
 *
 * @property UserService $service
 *
 * @package App\Http\Controllers
 */
class LoginController extends Controller
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
     * Login user with email and password or remember token
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $validator = $this->service->validateLoginRequest($request);

            if (!$validator->passes()) {
                return $this->userErrorResponse($validator->messages()->toArray());
            }

            /** @var User|null $user */
            $user = $this->service->loginUser($request->only('email', 'password'));

            if (!$user) {
                return $this->userErrorResponse(['credentials' => 'Invalid credentials!']);
            }

            $loginData = $this->service->generateLoginData($user, $request->has('remember'));

            return $this->successResponse($loginData);
        } catch (Throwable $t) {
            Log::error(LogService::getThrowableTraceAsString($t, $request));

            return $this->errorResponse();
        }
    }

    /**
     * Login with remember token
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function loginWithRememberToken(Request $request): JsonResponse
    {
        try {
            $validator = $this->service->validateTokenLoginRequest($request);

            if (!$validator->passes()) {
                return $this->userErrorResponse($validator->messages()->toArray());
            }

            $rememberToken = $request->get('rememberToken');

            /** @var User|null $user */
            $user = $this->service->loginUserWithRememberToken($rememberToken);

            if (!$user) {
                return $this->userErrorResponse(['rememberToken' => 'Invalid token!']);
            }

            DB::beginTransaction();

            $this->service->updateRememberTokenAvailability($rememberToken);

            $loginData = $this->service->generateLoginData($user);

            DB::commit();

            return $this->successResponse($loginData);
        } catch (Throwable $t) {
            Log::error(LogService::getThrowableTraceAsString($t, $request));

            return $this->errorResponse();
        }
    }

    /**
     * Logout user
     *
     * @param  Request  $request
     *
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            /** @var User $user */
            $user = Auth::user();

            if ($request->has('rememberToken') || $request->has('everywhere')) {
                DB::beginTransaction();

                /** @var Builder $userTokens */
                $userTokens = UserToken::whereUserId($user->id)
                    ->whereType(User::TokenTypeRememberMe);

                if ($request->has('rememberToken')) {
                    $userTokens = $userTokens->where('token', $request->get('rememberToken'));
                }

                $userTokens->delete();

                DB::commit();
            }

            return $this->successResponse();
        } catch (Throwable $t) {
            Log::error(LogService::getThrowableTraceAsString($t, $request));

            return $this->errorResponse();
        }
    }
}
