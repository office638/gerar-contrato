import { useCallback } from 'react';
import { useAtom } from 'jotai';
import { formProgressAtom, formSteps } from '../store/form';
import { FormStep } from '../types/form';

export function useFormNavigation() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);

  const navigateToStep = useCallback((step: FormStep) => {
    setFormProgress(prev => ({
      ...prev,
      currentStep: step
    }));
  }, [setFormProgress]);

  const completeStep = useCallback((step: FormStep, data: any) => {
    setFormProgress(prev => ({
      ...prev,
      currentStep: formSteps[formSteps.findIndex(s => s.id === step) + 1]?.id || step,
      completedSteps: [...new Set([...prev.completedSteps, step])],
      data: {
        ...prev.data,
        [step]: data
      }
    }));
  }, [setFormProgress]);

  const canNavigateToStep = useCallback((step: FormStep) => {
    return formProgress.completedSteps.includes(step) || step === formProgress.currentStep;
  }, [formProgress.completedSteps, formProgress.currentStep]);

  return {
    currentStep: formProgress.currentStep,
    completedSteps: formProgress.completedSteps,
    formData: formProgress.data,
    navigateToStep,
    completeStep,
    canNavigateToStep
  };
}