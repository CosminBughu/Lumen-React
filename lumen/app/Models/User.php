<?php

namespace App\Models;

use Illuminate\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * Class User
 *
 * @package App\Models
 */
class User extends Model implements AuthenticatableContract, AuthorizableContract
{
    use Authenticatable, Authorizable, HasFactory;

    const TokenTypeRememberMe = 1;

    /** @var bool */
    public $timestamps = true;

    /** @var string */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar'
    ];

    /** @var string[] */
    protected $hidden = [
        'password'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Boot method
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($board) {
            $board->createdBoards()->delete();
            $board->boardUsers()->delete();
            $board->tasks()->update(['assignment' => null]);
        });
    }

    /**
     * User tokens.
     *
     * @return HasMany
     */
    public function userTokens(): HasMany
    {
        return $this->hasMany(UserToken::class, 'user_id', 'id');
    }

    /**
     * @return HasMany
     */
    public function createdBoards(): HasMany
    {
        return $this->hasMany(Board::class, 'user_id', 'id');
    }

    /**
     * @return HasMany
     */
    public function boardUsers(): HasMany
    {
        return $this->hasMany(BoardUser::class, 'user_id', 'id');
    }

    /**
     * @return BelongsToMany
     */
    public function boards(): BelongsToMany
    {
        return $this->belongsToMany(Board::class)->using(BoardUser::class);
    }

    /**
     * @return HasMany
     */
    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class, 'assignment', 'id');
    }

    /**
     * @return HasManyThrough
     */
    public function createdBoardsTasks(): HasManyThrough
    {
        return $this->hasManyThrough(Task::class, Board::class, 'user_id', 'board_id', 'id', 'id');
    }
}
