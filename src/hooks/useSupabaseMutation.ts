import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';

export function useSupabaseMutation(table: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(table);
      }
    }
  );
}

export function useSupabaseUpdate(table: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(table);
      }
    }
  );
}