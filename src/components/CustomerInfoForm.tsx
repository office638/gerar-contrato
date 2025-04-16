import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { useAtom } from 'jotai';
import { CustomerInfo, maritalStatusOptions } from '../types/form';
import { User, Phone, Mail, Briefcase, FileText, Loader2, Trash2, ArrowRight, AlertCircle } from 'lucide-react';
import { formProgressAtom } from '../store/form';
import { useSupabaseMutation } from '../hooks/useSupabaseMutation';
import { supabase } from '../lib/supabase';
import { useEffect } from 'react';

const schema = z.object({
  fullName: z.string().min(3).max(100),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  rg: z.string().max(20),
  issuingAuthority: z.string().max(50),
  profession: z.string().max(100),
  nationality: z.string().default('Brasileiro(a)'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  email: z.string().email('Email inválido')
});

export default function CustomerInfoForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [cpfError, setCpfError] = React.useState<string | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const { mutateAsync: saveCustomer } = useSupabaseMutation('customers');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CustomerInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      nationality: 'Brasileiro(a)',
      ...formProgress.data.customerInfo
    }
  });

  const cpf = watch('cpf');

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (!session) {
          setAuthError('Você precisa estar logado para continuar.');
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setAuthError('Erro ao verificar autenticação.');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Update form when customer data changes
  useEffect(() => {
    if (formProgress.data.customerInfo) {
      Object.entries(formProgress.data.customerInfo).forEach(([key, value]) => {
        setValue(key as keyof CustomerInfo, value);
      });
    }
  }, [formProgress.data.customerInfo, setValue]);

  // Check if CPF exists when the field loses focus
  const checkCpfExists = async (cpf: string) => {
    if (!cpf || cpf.includes('_')) return; // Don't check incomplete CPFs
    
    try {
      const { data: existingCustomer, error } = await supabase
        .from('customers')
        .select('id, full_name')
        .eq('cpf', cpf)
        .maybeSingle();

      if (error) throw error;

      if (existingCustomer) {
        // If this is an update for the same customer, don't show error
        if (formProgress.data.customerId === existingCustomer.id) {
          setCpfError(null);
          return false;
        } else {
          setCpfError(`CPF já cadastrado para o cliente: ${existingCustomer.full_name}`);
          return true;
        }
      }
      setCpfError(null);
      return false;
    } catch (error) {
      console.error('Error checking CPF:', error);
      return false;
    }
  };

  const onSubmit = async (data: CustomerInfo) => {
    try {
      setIsSubmitting(true);
      setAuthError(null);
      
      // Check authentication status before proceeding
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAuthError('Você precisa estar logado para salvar os dados.');
        return;
      }
      
      // Check CPF one last time before submitting
      const isInvalidCpf = await checkCpfExists(data.cpf);
      if (isInvalidCpf) {
        setIsSubmitting(false);
        return;
      }
      
      const savedCustomer = await saveCustomer({
        id: formProgress.data.customerId,
        full_name: data.fullName,
        cpf: data.cpf,
        rg: data.rg,
        issuing_authority: data.issuingAuthority,
        profession: data.profession,
        nationality: data.nationality,
        phone: data.phone,
        email: data.email,
        marital_status: data.maritalStatus
      });
      
      // Store the customer ID for linking other records
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'installation-location',
        completedSteps: [...prev.completedSteps, 'customer-info'],
        data: {
          ...prev.data,
          customerId: savedCustomer.id,
          customerInfo: data
        }
      }));
    } catch (error) {
      console.error('Error saving customer info:', error);
      if (error.message?.includes('customers_cpf_key')) {
        setCpfError('Este CPF já está cadastrado no sistema.');
      } else if (error.message?.includes('Auth session missing')) {
        setAuthError('Sessão expirada. Por favor, faça login novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center text-red-600 p-4">
          <AlertCircle className="w-6 h-6 mr-2" />
          <p>{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Informações do Cliente</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <User size={18} className="mr-2" />
              Nome Completo
            </label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu nome completo"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Estado Civil
            </label>
            <select
              {...register('maritalStatus')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {maritalStatusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.maritalStatus && (
              <p className="text-red-500 text-sm">{errors.maritalStatus.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText size={18} className="mr-2" />
              CPF
            </label>
            <InputMask
              mask="999.999.999-99"
              {...register('cpf')}
              onBlur={(e) => checkCpfExists(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                cpfError ? 'border-red-500' : ''
              }`}
              placeholder="000.000.000-00"
            />
            {(errors.cpf || cpfError) && (
              <p className="text-red-500 text-sm flex items-center">
                <AlertCircle size={16} className="mr-1" />
                {errors.cpf?.message || cpfError}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <FileText size={18} className="mr-2" />
              RG
            </label>
            <input
              type="text"
              {...register('rg')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu RG"
            />
            {errors.rg && (
              <p className="text-red-500 text-sm">{errors.rg.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Órgão Emissor
            </label>
            <input
              type="text"
              {...register('issuingAuthority')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SSP/UF"
            />
            {errors.issuingAuthority && (
              <p className="text-red-500 text-sm">{errors.issuingAuthority.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Briefcase size={18} className="mr-2" />
              Profissão
            </label>
            <input
              type="text"
              {...register('profession')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua profissão"
            />
            {errors.profession && (
              <p className="text-red-500 text-sm">{errors.profession.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nacionalidade
            </label>
            <input
              type="text"
              {...register('nationality')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.nationality && (
              <p className="text-red-500 text-sm">{errors.nationality.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Phone size={18} className="mr-2" />
              Telefone
            </label>
            <InputMask
              mask="(99) 99999-9999"
              {...register('phone')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(00) 00000-0000"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Mail size={18} className="mr-2" />
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => {
              reset({
                nationality: 'Brasileiro(a)'
              });
              setCpfError(null);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Campos
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}