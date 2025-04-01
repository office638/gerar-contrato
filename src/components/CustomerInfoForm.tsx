import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { useAtom } from 'jotai';
import { CustomerInfo, maritalStatusOptions } from '../types/form';
import { User, Phone, Mail, Briefcase, FileText, Loader2 } from 'lucide-react';
import { formProgressAtom } from '../store/form';

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

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CustomerInfo>({
    resolver: zodResolver(schema),
    defaultValues: {
      nationality: 'Brasileiro(a)',
      ...formProgress.data.customerInfo
    }
  });

  const onSubmit = async (data: CustomerInfo) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'installation-location',
        completedSteps: [...prev.completedSteps, 'customer-info'],
        data: {
          ...prev.data,
          customerInfo: data
        }
      }));
    } catch (error) {
      console.error('Error saving customer info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="text-red-500 text-sm">{errors.cpf.message}</p>
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

        <div className="flex justify-end">
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
              'Próximo'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}