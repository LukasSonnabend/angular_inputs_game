import { Injectable } from '@angular/core'
import {
  AuthChangeEvent,
  AuthSession,
  createClient,
  Session,
  SupabaseClient,
  User,
} from '@supabase/supabase-js'
import { environment } from '../environments'

export interface Profile {
  id?: string
  username: string
  website: string
  avatar_url: string
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseService {
  private supabase: SupabaseClient
  _session: AuthSession | null = null

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  get session() {
    this.supabase.auth.getSession().then(({ data }) => {
      this._session = data.session
    })
    return this._session
  }

  profile(user: User) {
    return this.supabase
      .from('profiles')
      .select(`username, website, avatar_url`)
      .eq('id', user.id)
      .single()
  }

  authChanges(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.supabase.auth.onAuthStateChange(callback)
  }

  signIn(email: string) {
    return this.supabase.auth.signInWithOtp({ email })
  }

  signOut() {
    return this.supabase.auth.signOut()
  }

  updateProfile(profile: Profile) {
    const update = {
      ...profile,
      updated_at: new Date(),
    }

    return this.supabase.from('profiles').upsert(update)
  }

async insertIntoSaves(incomingData: any[]) {
 
    const { data, error } = await this.supabase
    .from('Saves')
    .insert(
        incomingData.map(i => {
            return {
                data: i
            }
        })
    )
    .select()
            
  if (error) {
    console.error('Error inserting data: ', error)
    return null
  }

  return data
}

async loadLastSave() {
    const { data, error } = await this.supabase
    .from('Saves')
    .select('data')
    .order('created_at', { ascending: false })
    .limit(1)
    if (error) {
        console.error('Error loading data: ', error)
        return null
    }

    let parsedData = JSON.parse(data[0].data)

    console.log('Loaded data:', parsedData)

    return parsedData
}


  downLoadImage(path: string) {
    return this.supabase.storage.from('avatars').download(path)
  }

  uploadAvatar(filePath: string, file: File) {
    return this.supabase.storage.from('avatars').upload(filePath, file)
  }
}