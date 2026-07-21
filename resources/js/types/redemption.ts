import type { User } from './auth';
import type { Reward } from './reward';

export interface TukarPoin {
    id: number;
    user_id: number;
    admin_id: number | null;
    reward_id: number;
    quantity: number;
    total_price: number;
    status: 'pending' | 'process' | 'done' | 'rejected';
    created_at: string;
    updated_at?: string;
    user?: User;
    admin?: User;
    reward?: Reward;
}
