<?php

namespace App\Services;

use App\Constants\TranslationCode;
use App\Enums\UserStatus;
use App\Enums\UserTokenType;
use App\Models\Language;
use App\Models\User;
use App\Models\UserToken;
use App\Services\Concerns\BaseService;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\Validator as ContractsValidator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use IonGhitun\JwtToken\Jwt;
use Laravel\Socialite\Two\User as SocialiteUser;

/**
 * Class UserService
 *
 * @package App\Services
 */
class UserService
{
    /**
     * Validate request on login
     *
     * @param  Request  $request
     *
     * @return ContractsValidator
     */
    public function validateLoginRequest(Request $request): ContractsValidator
    {
        $rules = [
            'email' => 'required|email|exists:users,email',
            'password' => 'required'
        ];

        return Validator::make($request->all(), $rules);
    }

    /**
     * Validate request on login with remember token
     *
     * @param  Request  $request
     *
     * @return ContractsValidator
     */
    public function validateTokenLoginRequest(Request $request): ContractsValidator
    {
        $rules = [
            'rememberToken' => 'required'
        ];

        return Validator::make($request->all(), $rules);
    }

    /**
     * Get user from email and password
     *
     * @param  array  $credentials
     *
     * @return User|null
     */
    public function loginUser(array $credentials): ?User
    {
        /** @var User|null $user */
        $user = User::where('email', $credentials['email'])
            ->first();

        if (!$user) {
            return null;
        }

        $password = $user->password;

        if (app('hash')->check($credentials['password'], $password)) {
            return $user;
        }

        return null;
    }

    /**
     * Generate returned data on login
     *
     * @param  User  $user
     * @param  false  $remember
     *
     * @return array
     */
    public function generateLoginData(User $user, bool $remember = false): array
    {
        $data = [
            'user' => $user,
            'token' => Jwt::generateToken([
                'id' => $user->id
            ])
        ];

        if ($remember) {
            $data['rememberToken'] = $this->generateRememberMeToken($user->id);
        }

        return $data;
    }

    /**
     * Generate remember me token
     *
     * @param $userId
     * @param $days
     *
     * @return string
     */
    public function generateRememberMeToken($userId, $days = 14): string
    {
        $userToken = new UserToken();

        $userToken->user_id = $userId;
        $userToken->token = Str::random(64);
        $userToken->type = User::TokenTypeRememberMe;
        $userToken->expire_on = Carbon::now()->addDays($days)->format('Y-m-d H:i:s');

        $userToken->save();

        return $userToken->token;
    }

    /**
     * Login user with remembered token
     *
     * @param $token
     *
     * @return User|null
     */
    public function loginUserWithRememberToken($token): ?User
    {
        /** @var User|null $user */
        $user = User::whereHas('userTokens', function ($query) use ($token) {
            $query->where('token', $token)
                ->where('expire_on', '>=', Carbon::now()->format('Y-m-d H:i:s'));
        })->first();

        return $user;
    }

    /**
     * Update remember token validity when used on login
     *
     * @param $token
     * @param  int  $days
     */
    public function updateRememberTokenAvailability($token, $days = 14)
    {
        $userToken = UserToken::where('token', $token)
            ->where('type', User::TokenTypeRememberMe)
            ->first();

        if ($userToken) {
            $userToken->expire_on = Carbon::now()->addDays($days)->format('Y-m-d H:i:s');

            $userToken->save();
        }
    }
}
