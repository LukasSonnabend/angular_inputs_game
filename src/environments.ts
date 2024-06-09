  export const environment = {
    production: false,
    supabaseUrl: 'https://ouvkkcyukuwyplyaotyr.supabase.co',
    supabaseKey: getSupabaseKey(),
  }
  
  function getSupabaseKey(): string {
    // Try to get the key from localStorage
    let key = localStorage.getItem('supabaseKey') || '';
  
    // If the key is not in localStorage, prompt for it and save it to localStorage
    if (!key) {
      key = window.prompt('Enter your Supabase key') || '';
      localStorage.setItem('supabaseKey', key);
    }
  
    return key;
  }