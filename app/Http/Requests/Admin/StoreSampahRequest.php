<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreSampahRequest extends FormRequest
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
            'category_id' => ['required', 'exists:sampah_categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'price_per_kg' => ['required', 'integer', 'min:1'],
        ];
    }
}
