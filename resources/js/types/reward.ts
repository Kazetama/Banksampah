export interface Reward {
    id: number;
    name: string;
    category: string;
    description: string | null;
    price: number;
    image: string | null;
    stock: number;
    created_at?: string;
    updated_at?: string;
}
