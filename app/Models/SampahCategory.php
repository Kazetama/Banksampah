<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SampahCategory extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Sampah, $this>
     */
    public function sampah(): HasMany
    {
        return $this->hasMany(Sampah::class, 'category_id');
    }
}
