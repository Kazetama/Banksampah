<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreTransactionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'user_id' => ['required', 'exists:users,id'],
            'sampah_name' => ['required', 'string', 'max:255'],
            'total_weight' => ['required', 'numeric', 'min:0.1'],
            'custom_price_per_kg' => ['required', 'numeric', 'min:0'],
        ];
    }
}
