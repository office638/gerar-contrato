import React from 'react';
import CustomerInfoForm from './CustomerInfoForm';
import InstallationLocationForm from './InstallationLocationForm';
import TechnicalConfigForm from './TechnicalConfigForm';
import FinancialTermsForm from './FinancialTermsForm';
import ReviewForm from './ReviewForm';
import ProgressBar from './ProgressBar';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';

export default function ContractFlow() {
  const [formProgress] = useAtom(formProgressAtom);

  const renderCurrentStep = () => {
    switch (formProgress.currentStep) {
      case 'customer-info':
        return <CustomerInfoForm />;
      case 'installation-location':
        return <InstallationLocationForm />;
      case 'technical-config':
        return <TechnicalConfigForm />;
      case 'financial-terms':
        return <FinancialTermsForm />;
      case 'review':
        return <ReviewForm />;
      default:
        return <CustomerInfoForm />;
    }
  };

  return (
    <div>
      <ProgressBar />
      {renderCurrentStep()}
    </div>
  );
}