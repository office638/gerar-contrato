import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { Loader2, Ruler, Wrench, AlertTriangle } from 'lucide-react';

const schema = z.object({
  roofType: z.enum(['Ceramic', 'Metal', 'Fiber_Cement', 'Concrete', 'Other']),
  otherRoofType: z.string().optional(),
  roofInclination: z.number().min(0).max(90),
  structureType: z.enum(['Aluminum', 'Steel', 'Other']),
  otherStructureType: z.string().optional(),
  installationNotes: z.string().optional(),
  accessibilityLevel: z.enum(['Easy', 'Medium', 'Difficult']),
  safetyRequirements: z.array(z.string()),
  additionalEquipment: z.array(z.string())
});

type InstallationSpecs = z.infer<typeof schema>;

const roofTypes = [
  { value: 'Ceramic', label: 'Cerâmica' },
  { value: 'Metal', label: 'Metálico' },
  { value: 'Fiber_Cement', label: 'Fibrocimento' },
  { value: 'Concrete', label: 'Concreto' },
  { value: 'Other', label: 'Outro' }
] as const;

const structureTypes = [
  { value: 'Aluminum', label: 'Alumínio' },
  { value: 'Steel', label: 'Aço' },
  { value: 'Other', label: 'Outro' }
] as const;

const accessibilityLevels = [
  { value: 'Easy', label: 'Fácil' },
  { value: 'Medium', label: 'Médio' },
  { value: 'Difficult', label: 'Difícil' }
] as const;

const safetyRequirementOptions = [
  { id: 'harness', label: 'Cinto de Segurança' },
  { id: 'helmet', label: 'Capacete' },
  { id: 'gloves', label: 'Luvas' },
  { id: 'boots', label: 'Botas' },
  { id: 'goggles', label: 'Óculos de Proteção' },
  { id: 'scaffold', label: 'Andaime' }
];

const additionalEquipmentOptions = [
  { id: 'ladder', label: 'Escada' },
  { id: 'crane', label: 'Guindaste' },
  { id: 'generator', label: 'Gerador' },
  { id: 'tools', label: 'Kit de Ferramentas Especiais' },
  { id: 'lighting', label: 'Iluminação' }
];

export default function InstallationSpecsForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<InstallationSpecs>({
    resolver: zodResolver(schema),
    defaultValues: {
      safetyRequirements: [],
      additionalEquipment: []
    }
  });

  const roofType = watch('roofType');
  const structureType = watch('structureType');

  const onSubmit = async (data: InstallationSpecs) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'financial-terms',
        completedSteps: [...prev.completedSteps, 'installation-specs'],
        data: {
          ...prev.data,
          installationSpecs: data
        }
      }));
    } catch (error) {
      console.error('Error saving installation specs:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Especificações da Instalação</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Roof Specifications */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Ruler className="w-5 h-5 mr-2" />
            Especificações do Telhado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Telhado
              </label>
              <select
                {...register('roofType')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o tipo</option>
                {roofTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.roofType && (
                <p className="text-red-500 text-sm">{errors.roofType.message}</p>
              )}
            </div>

            {roofType === 'Other' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Especificação do Tipo de Telhado
                </label>
                <input
                  type="text"
                  {...register('otherRoofType')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o tipo de telhado"
                />
                {errors.otherRoofType && (
                  <p className="text-red-500 text-sm">{errors.otherRoofType.message}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Inclinação do Telhado (graus)
              </label>
              <input
                type="number"
                {...register('roofInclination', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="90"
              />
              {errors.roofInclination && (
                <p className="text-red-500 text-sm">{errors.roofInclination.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Structure Type */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Wrench className="w-5 h-5 mr-2" />
            Tipo de Estrutura
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Material da Estrutura
              </label>
              <select
                {...register('structureType')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o material</option>
                {structureTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.structureType && (
                <p className="text-red-500 text-sm">{errors.structureType.message}</p>
              )}
            </div>

            {structureType === 'Other' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Especificação do Material
                </label>
                <input
                  type="text"
                  {...register('otherStructureType')}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva o material"
                />
                {errors.otherStructureType && (
                  <p className="text-red-500 text-sm">{errors.otherStructureType.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Installation Notes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Observações da Instalação
          </h3>
          <div className="space-y-2">
            <textarea
              {...register('installationNotes')}
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Adicione observações importantes sobre a instalação"
            />
            {errors.installationNotes && (
              <p className="text-red-500 text-sm">{errors.installationNotes.message}</p>
            )}
          </div>
        </div>

        {/* Accessibility and Safety */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Acessibilidade e Segurança
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nível de Acessibilidade
              </label>
              <select
                {...register('accessibilityLevel')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione o nível</option>
                {accessibilityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.accessibilityLevel && (
                <p className="text-red-500 text-sm">{errors.accessibilityLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamentos de Segurança Necessários
              </label>
              <div className="grid grid-cols-2 gap-2">
                {safetyRequirementOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={option.id}
                      value={option.id}
                      {...register('safetyRequirements')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={option.id} className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.safetyRequirements && (
                <p className="text-red-500 text-sm">{errors.safetyRequirements.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Equipamentos Adicionais
              </label>
              <div className="grid grid-cols-2 gap-2">
                {additionalEquipmentOptions.map(option => (
                  <div key={option.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`equipment-${option.id}`}
                      value={option.id}
                      {...register('additionalEquipment')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor={`equipment-${option.id}`} className="ml-2 text-sm text-gray-700">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.additionalEquipment && (
                <p className="text-red-500 text-sm">{errors.additionalEquipment.message}</p>
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