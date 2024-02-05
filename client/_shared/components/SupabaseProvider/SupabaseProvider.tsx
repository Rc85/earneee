import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

interface Props {
  supabaseUrl: string;
  supabaseKey: string;
  children: any;
}

export const SupabaseContext = createContext<{ supabase: SupabaseClient | null }>({ supabase: null });

const SupabaseProvider = ({ supabaseUrl, supabaseKey, children }: Props) => {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      const client = createClient(supabaseUrl, supabaseKey);

      if (client) {
        setSupabase(client);
      }
    }
  }, [supabaseUrl, supabaseKey]);

  return <SupabaseContext.Provider value={{ supabase }}>{children}</SupabaseContext.Provider>;
};

export default SupabaseProvider;
