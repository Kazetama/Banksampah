<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reward extends Model
{
    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'image',
        'stock',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<TukarPoin, $this>
     */
    public function tukarPoins(): HasMany
    {
        return $this->hasMany(TukarPoin::class, 'reward_id');
    }
}
