export interface SampahCategory {
    id: number;
    name: string;
    description: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Sampah {
    id: number;
    category_id: number;
    name: string;
    price_per_kg: number;
    image: string | null;
    created_at?: string;
    updated_at?: string;
    category?: SampahCategory;
}
