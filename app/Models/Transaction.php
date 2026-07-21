<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'admin_id',
        'sampah_id',
        'total_weight',
        'total_income',
        'point_received',
        'created_at',
    ];

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User, $this>
     */
    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    /**
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Sampah, $this>
     */
    public function sampah(): BelongsTo
    {
        return $this->belongsTo(Sampah::class, 'sampah_id');
    }
}
