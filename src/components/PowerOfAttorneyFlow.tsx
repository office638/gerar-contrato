import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSupabaseMutation } from '../hooks/useSupabaseMutation';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import InputMask from 'react-input-mask';
import { User, FileText, MapPin, Loader2 } from 'lucide-react';
import { brazilianStates } from '../types/form';
import { generatePowerOfAttorney } from '../utils/generatePowerOfAttorney';

const schema = z.object({
  fullName: z.string().min(3).max(100),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  rg: z.string().max(20),
  issuingAuthority: z.string().max(50),
  utilityCompany: z.string().min(1, 'Nome da concessionária é obrigatório'),
  street: z.string().min(3).max(200),
  number: z.string().max(20),
  neighborhood: z.string().max(100),
  city: z.string().max(100),
  state: z.enum(brazilianStates as [string, ...string[]]),
});

type PowerOfAttorneyData = z.infer<typeof schema>;

export default function PowerOfAttorneyFlow() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formProgress] = useAtom(formProgressAtom);
  const { mutateAsync: savePowerOfAttorney } = useSupabaseMutation('power_of_attorney');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<PowerOfAttorneyData>({
    resolver: zodResolver(schema)
  });

  // Reset form when powerOfAttorney data is null
  useEffect(() => {
    if (formProgress.data.powerOfAttorney === null) {
      reset({
        fullName: '',
        cpf: '',
        rg: '',
        issuingAuthority: '',
        street: '',
        number: '',
        neighborhood: '',
        city: '',
        state: '' as any
      });
    }
  }, [formProgress.data.powerOfAttorney, reset]);

  // Load data from formProgress if available
  useEffect(() => {
    if (formProgress.data.powerOfAttorney && formProgress.data.powerOfAttorney !== null) {
      const data = formProgress.data.powerOfAttorney;
      Object.entries(data).forEach(([key, value]) => {
        setValue(key as keyof PowerOfAttorneyData, value);
      });
    }
  }, [formProgress.data.powerOfAttorney, setValue]);

  const onSubmit = async (data: PowerOfAttorneyData) => {
    try {
      setIsSubmitting(true);
      
      // Save to database
      await savePowerOfAttorney({
        full_name: data.fullName,
        cpf: data.cpf,
        rg: data.rg,
        issuing_authority: data.issuingAuthority,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state
      });

      // Generate PDF
      const powerOfAttorneyBlob = await generatePowerOfAttorney({
        customerInfo: {
          fullName: data.fullName,
          cpf: data.cpf,
          rg: data.rg,
          issuingAuthority: data.issuingAuthority,
          nationality: 'Brasileiro(a)',
          profession: '',
          phone: '',
          email: '',
          maritalStatus: 'Single'
        },
        installationLocation: {
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: '',
          utilityCode: '',
          utilityCompany: data.utilityCompany,
          installationType: 'Residential'
        }
      });
      
      // Download PDF
      const url = window.URL.createObjectURL(powerOfAttorneyBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'procuracao-sistema-fotovoltaico.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Reset form
      reset();
      
    } catch (error) {
      console.error('Error generating power of attorney:', error);
      alert('Erro ao gerar procuração. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gerar Procuração</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações Pessoais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
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
              <label className="block text-sm font-medium text-gray-700">
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
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Concessionária
            </label>
            <input
              type="text"
              {...register('utilityCompany')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome da Concessionária"
            />
            {errors.utilityCompany && (
              <p className="text-red-500 text-sm">{errors.utilityCompany.message}</p>
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Endereço
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Rua/Avenida
              </label>
              <input
                type="text"
                {...register('street')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nome da rua"
              />
              {errors.street && (
                <p className="text-red-500 text-sm">{errors.street.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Número
              </label>
              <input
                type="text"
                {...register('number')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número"
              />
              {errors.number && (
                <p className="text-red-500 text-sm">{errors.number.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <input
                type="text"
                {...register('neighborhood')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Bairro"
              />
              {errors.neighborhood && (
                <p className="text-red-500 text-sm">{errors.neighborhood.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cidade
              </label>
              <input
                type="text"
                {...register('city')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Cidade"
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Estado
              </label>
              <select
                {...register('state')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o estado</option>
                {brazilianStates.map(state => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
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
                Gerando Procuração...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Procuração
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}