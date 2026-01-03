export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string
          name: string
          email: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          created_at?: string
        }
      }

      itineraries: {
        Row: {
          id: string
          account_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          visibility: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          account_id: string
          title: string
          destination: string
          start_date: string
          end_date: string
          visibility: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          title?: string
          destination?: string
          start_date?: string
          end_date?: string
          visibility?: string
          created_at?: string
          updated_at?: string
        }
      }

      itinerary_days: {
        Row: {
          id: string
          itinerary_id: string
          day_index: number
          date: string | null
        }
        Insert: {
          id?: string
          itinerary_id: string
          day_index: number
          date?: string | null
        }
        Update: {
          id?: string
          itinerary_id?: string
          day_index?: number
          date?: string | null
        }
      }

      activities: {
        Row: {
          id: string
          day_id: string
          title: string
          description: string | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          day_id: string
          title: string
          description?: string | null
          position: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day_id?: string
          title?: string
          description?: string | null
          position?: number
          created_at?: string
          updated_at?: string
        }
      }

      itinerary_bookmarks: {
        Row: {
          id: string
          account_id: string
          itinerary_id: string
          created_at: string
        }
        Insert: {
          id?: string
          account_id: string
          itinerary_id: string
          created_at?: string
        }
        Update: {
          id?: string
          account_id?: string
          itinerary_id?: string
          created_at?: string
        }
      }
    }
  }
}
