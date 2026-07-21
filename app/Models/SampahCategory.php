<?php

namespace App\Models;

use Database\Factories\SampahCategoryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SampahCategory extends Model
{
    /** @use HasFactory<SampahCategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return HasMany<Sampah, $this>
     */
    public function sampah(): HasMany
    {
        return $this->hasMany(Sampah::class, 'category_id');
    }
}
