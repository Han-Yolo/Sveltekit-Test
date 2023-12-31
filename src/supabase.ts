export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
	public: {
		Tables: {
			game_of_life: {
				Row: {
					created_at: string
					horizontal_world_size: number
					save_state: boolean[]
					user_id: string
					vertical_world_size: number
				}
				Insert: {
					created_at?: string
					horizontal_world_size?: number
					save_state?: boolean[]
					user_id?: string
					vertical_world_size?: number
				}
				Update: {
					created_at?: string
					horizontal_world_size?: number
					save_state?: boolean[]
					user_id?: string
					vertical_world_size?: number
				}
				Relationships: []
			}
			messages: {
				Row: {
					content: string
					created_at: string
					id: number
					user_id: string
				}
				Insert: {
					content: string
					created_at?: string
					id?: number
					user_id?: string
				}
				Update: {
					content?: string
					created_at?: string
					id?: number
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'messages_user_id_fkey'
						columns: ['user_id']
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			[_ in never]: never
		}
		Enums: {
			[_ in never]: never
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

export type Tables<T extends keyof Database['public']['Tables']> =
	Database['public']['Tables'][T]['Row']
