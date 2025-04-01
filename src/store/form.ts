import { atom } from 'jotai';
import { FormProgress, FormStep } from '../types/form';

// Load initial state from localStorage if available
const loadInitialState = (): FormProgress => {
  try {
    const savedState = localStorage.getItem('formProgress');
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Convert date strings back to Date objects
      if (parsed.data.financialTerms?.installments) {
        parsed.data.financialTerms.installments = parsed.data.financialTerms.installments.map(
          (inst: any) => ({
            ...inst,
            dueDate: new Date(inst.dueDate)
          })
        );
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading form state:', error);
  }
  return {
    currentStep: 'customer-info',
    completedSteps: [],
    data: {}
  };
};

const baseAtom = atom<FormProgress>(loadInitialState());

export const formProgressAtom = atom(
  (get) => get(baseAtom),
  (get, set, update: FormProgress | ((prev: FormProgress) => FormProgress)) => {
    const newValue = typeof update === 'function' ? update(get(baseAtom)) : update;
    set(baseAtom, newValue);
    try {
      localStorage.setItem('formProgress', JSON.stringify(newValue));
    } catch (error) {
      console.error('Error saving form state:', error);
    }
  }
);

export const formSteps: { id: FormStep; label: string; icon: keyof typeof import('lucide-react') }[] = [
  { id: 'customer-info', label: 'Informações do Cliente', icon: 'User' },
  { id: 'installation-location', label: 'Local da Instalação', icon: 'MapPin' },
  { id: 'technical-config', label: 'Configuração Técnica', icon: 'Zap' },
  { id: 'financial-terms', label: 'Termos Financeiros', icon: 'DollarSign' },
  { id: 'review', label: 'Revisão e Geração', icon: 'FileText' }
];