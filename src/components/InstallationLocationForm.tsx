import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import InputMask from 'react-input-mask';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { useSupabaseMutation } from '../hooks/useSupabaseMutation';
import { MapPin, Building2, Hash, Home, Loader2, Zap, ArrowLeft, ArrowRight, Trash2 } from 'lucide-react';


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
  utilityCode: z.string().max(20).optional(),
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
  const { mutateAsync: saveLocation } = useSupabaseMutation('installation_locations');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
    formState: { errors }
  } = useForm<InstallationLocation>({
    resolver: zodResolver(schema),
    defaultValues: formProgress.data.installationLocation,
    mode: 'onChange'
  });

  const onSubmit = async (data: InstallationLocation) => {
    try {
      setIsSubmitting(true);
      
      // Only proceed if we have a valid customer ID
      if (!formProgress.data.customerId) {
        throw new Error('Por favor, preencha as informações do cliente primeiro.');
      }
      
      // Save or update the location data
      const savedLocation = await saveLocation({
        id: formProgress.data.installationLocationId,
        customer_id: formProgress.data.customerId,
        street: data.street,
        number: data.number,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
        utility_code: data.utilityCode,
        utility_company: data.utilityCompany,
        installation_type: data.installationType
      });
      
      // Then update the form progress
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'technical-config',
        completedSteps: Array.from(new Set([...prev.completedSteps, 'installation-location'])),
        data: {
          ...prev.data,
          installationLocation: data,
          installationLocationId: savedLocation.id
        }
      }));
    } catch (error) {
      console.error('Error saving installation location:', error);
      // Show a more specific error message
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Erro ao salvar dados do local. Certifique-se de preencher os dados do cliente primeiro.');
      }
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
            {errors.street && <p className="text-red-500 text-sm">{errors.street.message}</p>}
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
            {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
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
            {errors.neighborhood && <p className="text-red-500 text-sm">{errors.neighborhood.message}</p>}
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
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Estado</label>
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
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">CEP</label>
            <InputMask
              mask="99999-999"
              {...register('zipCode')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="00000-000"
            />
            {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode.message}</p>}
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
            {errors.utilityCompany && <p className="text-red-500 text-sm">{errors.utilityCompany.message}</p>}
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
            {errors.installationType && <p className="text-red-500 text-sm">{errors.installationType.message}</p>}
          </div>
        </div>

        <div className="flex justify-between pt-4 gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => {
              setFormProgress(prev => ({
                ...prev,
                currentStep: 'customer-info'
              }));
            }}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <button
            type="button"
            onClick={() => reset({
              state: '',
              installationType: 'Residential',
              utilityCode: '',
              utilityCompany: '',
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              zipCode: ''
            })}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpar Campos
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            onClick={() => {
              if (!isSubmitting) {
                setFormProgress(prev => ({
                  ...prev,
                  currentStep: 'technical-config',
                  completedSteps: Array.from(new Set([...prev.completedSteps, 'installation-location']))
                }));
              }
            }}
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