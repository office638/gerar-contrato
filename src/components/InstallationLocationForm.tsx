import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { MapPin, Building2, Hash, Home, Loader2, Zap } from 'lucide-react';

const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const schema = z.object({
  street: z.string().min(3).max(200),
  number: z.string().max(20),
  neighborhood: z.string().max(100),
  city: z.string().max(100),
  state: z.enum(brazilianStates as [string, ...string[]]),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  utilityCode: z.string().max(20),
  utilityCompany: z.string().min(1, 'Nome da concessionária é obrigatório'),
  installationType: z.enum(['Residential', 'Commercial', 'Industrial'])
});

type InstallationLocation = z.infer<typeof schema>;

const installationTypes = [
  { value: 'Residential', label: 'Residencial' },
  { value: 'Commercial', label: 'Comercial' },
  { value: 'Industrial', label: 'Industrial' }
];

export default function InstallationLocationForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<InstallationLocation>({
    resolver: zodResolver(schema),
    defaultValues: formProgress.data.installationLocation
  });

  const onSubmit = async (data: InstallationLocation) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'technical-config',
        completedSteps: [...prev.completedSteps, 'installation-location'],
        data: {
          ...prev.data,
          installationLocation: data
        }
      }));
    } catch (error) {
      console.error('Error saving installation location:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Local da Instalação</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin size={18} className="mr-2" />
              Endereço
            </label>
            <input
              type="text"
              {...register('street')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Rua/Avenida"
            />
            {errors.street && (
              <p className="text-red-500 text-sm">{errors.street.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Hash size={18} className="mr-2" />
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
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Building2 size={18} className="mr-2" />
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
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Building2 size={18} className="mr-2" />
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              CEP
            </label>
            <InputMask
              mask="99999-999"
              {...register('zipCode')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00000-000"
            />
            {errors.zipCode && (
              <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Hash size={18} className="mr-2" />
              Código da Unidade Consumidora (UC)
            </label>
            <input
              type="text"
              {...register('utilityCode')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Código UC"
            />
            {errors.utilityCode && (
              <p className="text-red-500 text-sm">{errors.utilityCode.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Zap size={18} className="mr-2" />
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

          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Home size={18} className="mr-2" />
              Tipo de Instalação
            </label>
            <select
              {...register('installationType')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione o tipo</option>
              {installationTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.installationType && (
              <p className="text-red-500 text-sm">{errors.installationType.message}</p>
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
