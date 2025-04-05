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
import CustomerSearch from './components/CustomerSearch';
import { QueryClient, QueryClientProvider } from 'react-query';
import { PlusCircle } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);

  const handleNewRegistration = () => {
    setFormProgress({
      currentStep: 'customer-info',
      completedSteps: [],
      data: {}
    });
  };

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
    <QueryClientProvider client={queryClient}>
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <button 
              className="flex items-center space-x-6 hover:opacity-80 transition-opacity"
            >
              <Sun className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gerador de Contratos de Energia Solar
              </h1>
            </button>
            <div className="flex items-center space-x-6">
              <button
                onClick={handleNewRegistration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Novo Cadastro
              </button>
              <CustomerSearch />
              <ExcelImportExport />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProgressBar />
        {renderCurrentStep()}
      </main>
    </div>
    </QueryClientProvider>
  );
}

export default App;
