<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Throwable;

/**
 * Class LogService
 *
 * @package App\Services
 */
class LogService
{
    /**
     * Get full trace of an throwable.
     *
     * @param  Throwable  $throwable
     * @param  Request|null  $request
     *
     * @return string
     */
    public static function getThrowableTraceAsString(Throwable $throwable, Request $request = null): string
    {
        /** @var User|null $user */
        $user = Auth::user();

        $errorString = '#00 Exception: '.$throwable->getCode().' --- '.$throwable->getMessage()."\n";
        $errorString .= '#01 User: '.($user ? $user->id.' --- '.$user->name : '')."\n";

        if ($request) {
            $errorString .= '#02 Request: '.json_encode($request->except(['password', 'retypePassword', 'oldPassword', 'retypePassword']), JSON_UNESCAPED_UNICODE)."\n";
        }

        $count = 0;

        foreach ($throwable->getTrace() as $frame) {
            $args = '';

            if (isset($frame['args'])) {
                $args = self::getFrameArgs($frame['args']);
            }

            $currentFile = $frame['file'] ?? '[internal function]';
            $currentLine = $frame['line'] ?? '';

            $errorString .= sprintf("#%s %s(%s): %s(%s)\n",
                $count,
                $currentFile,
                $currentLine,
                $frame['function'],
                $args);
            $count++;
        }

        return $errorString."\n";
    }

    /**
     * Get exception args
     *
     * @param $frameArgs
     *
     * @return string
     */
    private static function getFrameArgs($frameArgs): string
    {
        $args = array();

        foreach ($frameArgs as $arg) {
            if (is_string($arg)) {
                $args[] = '\''.$arg.'\'';
            } elseif (is_array($arg)) {
                $args[] = 'Array';
            } elseif (is_null($arg)) {
                $args[] = 'NULL';
            } elseif (is_bool($arg)) {
                $args[] = ($arg) ? 'true' : 'false';
            } elseif (is_object($arg)) {
                $args[] = get_class($arg);
            } elseif (is_resource($arg)) {
                $args[] = get_resource_type($arg);
            } else {
                $args[] = $arg;
            }
        }

        return join(', ', $args);
    }
}
