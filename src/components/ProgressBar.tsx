import React from 'react';
import { useAtom } from 'jotai';
import { formProgressAtom, formSteps } from '../store/form';
import * as Icons from 'lucide-react';
import { FormStep, FormProgress } from '../types/form';

export default function ProgressBar() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  
  const canNavigateToStep = (stepId: FormStep) => {
    const stepIndex = formSteps.findIndex(step => step.id === stepId);
    const currentIndex = formSteps.findIndex(step => step.id === formProgress.currentStep);
    
    // Can always navigate to current step or previous completed steps
    if (stepId === formProgress.currentStep || formProgress.completedSteps.includes(stepId)) {
      return true;
    }
    
    // Can navigate to next step only if current step is completed
    if (stepIndex === currentIndex + 1 && formProgress.completedSteps.includes(formSteps[currentIndex].id)) {
      return true;
    }
    
    return false;
  };

  const handleStepClick = (stepId: FormStep) => {
    if (canNavigateToStep(stepId)) {
      setFormProgress(prev => ({
        ...prev,
        currentStep: stepId
      }));
    }
  };

  return (
    <div className="w-full mb-8">
      <div className="hidden md:flex justify-between mb-2">
        {formSteps.map((step, index) => {
          const isCompleted = formProgress.completedSteps.includes(step.id);
          const isCurrent = formProgress.currentStep === step.id;
          const isClickable = canNavigateToStep(step.id);
          const Icon = Icons[step.icon];
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step.id)}
              className={`flex flex-col items-center flex-1 group transition-all duration-200 ${
                isClickable ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50'
              } ${isCurrent ? 'scale-105' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }
                  ${isClickable && 'group-hover:ring-2 group-hover:ring-offset-2 group-hover:ring-blue-500'}
                `}
              >
                {isCompleted ? (
                  <Icons.Check className="w-5 h-5" />
                ) : (
                  Icon && <Icon className="w-5 h-5" />
                )}
              </div>
              <span className="text-xs text-center">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {formSteps.find(step => step.id === formProgress.currentStep)?.label}
          </span>
          <span className="text-sm text-gray-500">
            {formProgress.completedSteps.length + 1} de {formSteps.length}
          </span>
        </div>
        <div className="relative h-2 bg-gray-200 rounded-full">
          <div
            className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{
              width: `${(formProgress.completedSteps.length / (formSteps.length - 1)) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Desktop Progress Bar */}
      <div className="hidden md:block relative h-2 bg-gray-200 rounded-full mt-2">
        <div
          className="absolute h-full bg-blue-500 rounded-full transition-all duration-300"
          style={{
            width: `${(formProgress.completedSteps.length / (formSteps.length - 1)) * 100}%`
          }}
        />
      </div>
    </div>
  );
}