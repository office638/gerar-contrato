import React from 'react';
import { useAtom } from 'jotai';
import CustomerInfoForm from './components/CustomerInfoForm';
import InstallationLocationForm from './components/InstallationLocationForm';
import TechnicalConfigForm from './components/TechnicalConfigForm';
import FinancialTermsForm from './components/FinancialTermsForm';
import ReviewForm from './components/ReviewForm';
import { Sun } from 'lucide-react';
import ProgressBar from './components/ProgressBar';
import { formProgressAtom } from './store/form';
import ExcelImportExport from './components/ExcelImportExport';

function App() {
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Sun className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gerador de Contratos de Energia Solar
              </h1>
            </div>
            <ExcelImportExport />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProgressBar />
        {renderCurrentStep()}
      </main>
    </div>
  );
}

export default App;
