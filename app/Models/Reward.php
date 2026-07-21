<?php

namespace App\Models;

use Database\Factories\RewardFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reward extends Model
{
    /** @use HasFactory<RewardFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'price',
        'image',
        'stock',
    ];

    /**
     * @return HasMany<TukarPoin, $this>
     */
    public function tukarPoins(): HasMany
    {
        return $this->hasMany(TukarPoin::class, 'reward_id');
    }
}
