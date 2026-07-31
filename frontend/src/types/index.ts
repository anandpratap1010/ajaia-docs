export interface User { id: number; name: string; email: string }
export interface Share { id: number; user: User; permission: string; created_at: string }
export interface DocumentSummary { id: number; title: string; owner: User; updated_at: string; access_type: 'owner' | 'shared' }
export interface DocumentList { owned: DocumentSummary[]; shared: DocumentSummary[] }
export interface DocumentDetail { id: number; title: string; content: Record<string, unknown>; owner: User; current_user_access: 'owner' | 'shared'; shared_users: Share[]; created_at: string; updated_at: string }
export interface Session { access_token: string; token_type: string; user: User }
