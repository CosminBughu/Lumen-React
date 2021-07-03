<?php

namespace App\Http\Controllers;

use App\Models\Board;

/**
 * Class BoardController
 *
 * @package App\Http\Controllers
 */
class BoardController extends Controller
{
    public function all()
    {
        $boards = Board::with(['user', 'boardUsers']);

        return $this->successResponse($boards->get()->toArray());
    }
}
