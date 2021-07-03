<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use IonGhitun\JwtToken\Jwt;
use Laravel\Lumen\Routing\Controller as BaseController;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class Controller
 *
 * @package App\Http\Controllers
 */
class Controller extends BaseController
{
    /** @var bool */
    private bool $isError = false;

    /** @var array */
    private array $errorMessages = [];

    /** @var bool */
    private bool $isForbidden = false;

    /** @var array */
    private array $forbiddenMessages = [];

    /** @var bool */
    private bool $userFault = false;

    /** @var array|null */
    private ?array $result = null;

    /** @var array|null */
    private ?array $pagination = null;

    /** @var bool */
    private bool $refreshToken = false;

    /**
     * Success response
     *
     * @param  array|null  $data
     * @param  array|null  $pagination
     *
     * @return JsonResponse
     */
    protected function successResponse(array $data = null, array $pagination = null): JsonResponse
    {
        $this->result = $data;
        $this->pagination = $pagination;

        return $this->buildResponse();
    }

    /**
     * Build the response.
     *
     * @param  int  $httpStatus
     *
     * @return JsonResponse
     */
    private function buildResponse(int $httpStatus = Response::HTTP_OK): JsonResponse
    {
        if ($this->isError) {
            $response = [
                'isError' => $this->isError,
                'userFault' => $this->userFault,
                'errorMessages' => $this->errorMessages
            ];
        } elseif ($this->isForbidden) {
            $response = [
                'isForbidden' => $this->isForbidden,
                'forbiddenMessages' => $this->forbiddenMessages
            ];
        } else {
            $response = [
                'isError' => $this->isError,
                'result' => $this->result,
                'pagination' => $this->pagination
            ];
        }

        if ($this->refreshToken && Auth::check()) {
            /** @var User $user */
            $user = Auth::user();

            $response['refreshedToken'] = Jwt::generateToken([
                'id' => $user->id
            ]);
        }

        return response()->json($response, $httpStatus);
    }

    /**
     * Return user fault response.
     *
     * @param  array  $errorMessages
     *
     * @return JsonResponse
     */
    protected function userErrorResponse(array $errorMessages): JsonResponse
    {
        $this->isError = true;
        $this->userFault = true;
        $this->errorMessages = $errorMessages;

        return $this->buildResponse(Response::HTTP_OK);
    }

    /**
     * Return application error response.
     *
     * @return JsonResponse
     */
    protected function errorResponse(): JsonResponse
    {
        $this->isError = true;
        $this->errorMessages = ['application' => 'Something went wrong!'];

        return $this->buildResponse(Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
