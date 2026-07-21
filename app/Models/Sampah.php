<?php

namespace App\Models;

use Database\Factories\SampahFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sampah extends Model
{
    /** @use HasFactory<SampahFactory> */
    use HasFactory;

    protected $table = 'sampah';

    protected $fillable = [
        'category_id',
        'name',
        'price_per_kg',
        'image',
    ];

    /**
     * @return BelongsTo<SampahCategory, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(SampahCategory::class, 'category_id');
    }

    /**
     * @return HasMany<Transaction, $this>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'sampah_id');
    }
}
