import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { Calendar, Clock, Loader2 } from 'lucide-react';

const schema = z.object({
  installationDays: z.number().min(1).max(365),
  writtenDuration: z.string().min(3).max(200)
});

type ProjectTimeline = z.infer<typeof schema>;

export default function ProjectTimelineForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ProjectTimeline>({
    resolver: zodResolver(schema),
    defaultValues: formProgress.data.projectTimeline
  });

  const onSubmit = async (data: ProjectTimeline) => {
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'review',
        completedSteps: [...prev.completedSteps, 'project-timeline'],
        data: {
          ...prev.data,
          projectTimeline: data
        }
      }));
    } catch (error) {
      console.error('Error saving project timeline:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Cronograma do Projeto</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Duração da Instalação
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock size={18} className="mr-2" />
                Dias para Instalação
              </label>
              <input
                type="number"
                {...register('installationDays', { valueAsNumber: true })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número de dias"
              />
              {errors.installationDays && (
                <p className="text-red-500 text-sm">{errors.installationDays.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duração por Extenso
              </label>
              <input
                type="text"
                {...register('writtenDuration')}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: quinze dias úteis"
              />
              {errors.writtenDuration && (
                <p className="text-red-500 text-sm">{errors.writtenDuration.message}</p>
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