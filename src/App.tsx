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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center justify-between mb-4 md:mb-0">
              <Sun className="h-8 w-8 text-yellow-500 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">
                Gerador de Contratos de Energia Solar
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <button
                onClick={handleNewRegistration}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                <span className="md:inline">Novo Cadastro</span>
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
