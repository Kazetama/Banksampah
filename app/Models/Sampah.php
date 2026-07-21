<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sampah extends Model
{
    protected $table = 'sampah';

    protected $fillable = [
        'category_id',
        'name',
        'price_per_kg',
        'image',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<SampahCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(SampahCategory::class, 'category_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'sampah_id');
    }
}
