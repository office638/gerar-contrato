import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';

export function useSupabaseMutation(table: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      if (!table) {
        throw new Error('Table name is required');
      }

      const { id, cpf, ...cleanData } = data;
      
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw new Error('User must be authenticated');
        }

        const dataWithUser = {
          ...cleanData,
          cpf,
          user_id: user.id
        };

        // Check for existing record
        let existingRecord = null;
        if (table === 'customers' && cpf) {
          const { data: existing } = await supabase
            .from(table)
            .select('id')
            .eq('cpf', cpf)
            .maybeSingle();
          existingRecord = existing;
        }

        // If record exists, update it
        if (existingRecord) {
          const { data: result, error } = await supabase
            .from(table)
            .update(dataWithUser)
            .eq('id', existingRecord.id)
            .select()
            .single();

          if (error) throw error;
          return result;
        } else {
          // Insert new record if no existing record found
          const { data: result, error } = await supabase
            .from(table)
            .insert(dataWithUser)
            .select()
            .single();
          
          if (error) throw error;
          return result;
        }

      } catch (error) {
        console.error(`[${table}] Operation error:`, error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(table);
      }
    }
  );
}