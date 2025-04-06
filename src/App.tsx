import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { Sun, Loader2, FileText, FileSignature, PlusCircle, History } from 'lucide-react';
import { formProgressAtom } from './store/form';
import ExcelImportExport from './components/ExcelImportExport';
import CustomerSearch from './components/CustomerSearch';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import AuthForm from './components/AuthForm';
import ContractFlow from './components/ContractFlow.tsx';
import PowerOfAttorneyFlow from './components/PowerOfAttorneyFlow';
import HistoryView from './components/HistoryView';
import LandingPage from './components/LandingPage';

const queryClient = new QueryClient();

function App() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState<'contract' | 'power-of-attorney' | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route path="/" element={!session ? <LandingPage /> : <Navigate to="/app" />} />
        <Route path="/login" element={!session ? <AuthForm /> : <Navigate to="/app" />} />
        <Route path="/register" element={!session ? <AuthForm isSignUp /> : <Navigate to="/app" />} />
        <Route
          path="/app/*"
          element={
            session ? (
              <div className="min-h-screen bg-gray-50">
                <header className="bg-white shadow-sm">
                  <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <img
                          src="https://imgur.com/DT6IwWn.jpg"
                          alt="Logo"
                          onClick={() => setSelectedFlow(null)}
                          className="h-8 cursor-pointer hover:opacity-80 transition-opacity mr-3" 
                        />
                        <div className="flex flex-col">
                          <h1 className="text-xl font-bold text-gray-900">
                            Meu Contrato Solar
                        </h1>
                          <span className="text-sm text-gray-600">
                            Gerador de Contratos de Energia Solar
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => supabase.auth.signOut()}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                </header>

                <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                  {!selectedFlow ? (
                    <div className="flex flex-col items-center justify-center gap-8">
                      <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                          Selecione o tipo de documento
                        </h2>
                        <p className="text-gray-600">
                          Escolha entre gerar um contrato completo ou apenas uma procuração
                        </p>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                        <button
                          onClick={() => setSelectedFlow('contract')}
                          className="flex items-center px-4 py-3 sm:px-6 sm:py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                        >
                          <FileText className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Gerar Contrato + Procuração</div>
                          </div>
                        </button>

                        <button
                          onClick={() => setSelectedFlow('power-of-attorney')}
                          className="flex items-center px-4 py-3 sm:px-6 sm:py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                          <FileSignature className="w-6 h-6 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Gerar Procuração</div>
                          </div>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-6 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedFlow(null)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          ← Voltar
                        </button>
                        <div className="flex items-center gap-4">
                          {showHistory && <CustomerSearch documentType={selectedFlow} />}
                          {selectedFlow === 'power-of-attorney' && (
                            <button
                              onClick={() => {
                                setFormProgress({
                                  currentStep: null,
                                  completedSteps: [],
                                  data: {
                                    powerOfAttorney: null
                                  }
                                });
                                setShowHistory(false);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Nova Procuração
                            </button>
                          )}
                          {selectedFlow === 'contract' && (
                            <button
                              onClick={() => {
                                setFormProgress({
                                  currentStep: 'customer-info',
                                  completedSteps: [],
                                  data: {}
                                });
                                setShowHistory(false);
                              }}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
                            >
                              <PlusCircle className="w-4 h-4 mr-2" />
                              Novo Cadastro
                            </button>
                          )}
                          <button
                            onClick={() => setShowHistory(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
                          >
                            <History className="w-4 h-4 mr-2" />
                            Histórico
                          </button>
                        </div>
                      </div>
                      
                      {selectedFlow === 'contract' ? (
                        showHistory ? (
                          <HistoryView type={selectedFlow} onSelect={() => setShowHistory(false)} />
                        ) : (
                          <ContractFlow />
                        )
                      ) : (
                        showHistory ? (
                          <HistoryView type={selectedFlow} onSelect={() => setShowHistory(false)} />
                        ) : (
                          <PowerOfAttorneyFlow />
                        )
                      )}
                    </div>
                  )}
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;