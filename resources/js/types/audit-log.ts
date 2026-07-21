import type { User } from './auth';

export interface AuditLog {
    id: number;
    user_id: number;
    action: string;
    description: string;
    ip_address: string | null;
    user_agent: string | null;
    created_at: string;
    user?: User;
}
