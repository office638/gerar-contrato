import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '../lib/supabase';

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

async function findExistingCustomer(cpf: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('id')
    .eq('cpf', cpf)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data?.id;
}

export function useSupabaseMutation(table: string) {
  const queryClient = useQueryClient();

  return useMutation(
    async (data: any) => {
      if (!table) {
        throw new Error('Table name is required');
      }

      const { id, ...cleanData } = data;
      
      try {
        const user = await getCurrentUser();
        if (!user) {
          throw new Error('User must be authenticated');
        }

        const dataWithUser = {
          ...cleanData,
          user_id: user.id
        };

        // For customers table, check if CPF exists
        let existingId = id;
        if (table === 'customers' && cleanData.cpf) {
          existingId = await findExistingCustomer(cleanData.cpf);
        }

        let query;
        if (existingId) {
          // Update with upsert
          query = supabase
            .from(table)
            .upsert({ id: existingId, ...dataWithUser })
            .select()
            .single();
        } else {
          // Insert new record
          query = supabase
            .from(table)
            .insert(dataWithUser)
            .select()
            .single();
        }

        const { data: result, error } = await query;

        if (error) {
          console.error(`[${table}] Operation error:`, error);
          throw new Error(`Failed to ${existingId ? 'update' : 'create'} record in ${table}: ${error.message}`);
        }

        if (!result) {
          throw new Error(`No data returned from ${table} operation`);
        }

        return result;

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