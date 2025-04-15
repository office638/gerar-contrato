import React from 'react';
import { Clock, FileText, MousePointer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <img
                  src="https://imgur.com/DT6IwWn.jpg"
                  alt="Logo"
                  className="h-8 hover:opacity-80 transition-opacity mr-3"
                />
                <div className="flex flex-col">
                  <h1 className="text-xl font-bold text-gray-900">
                    <span className="block md:hidden text-sm">Meu Contrato Solar</span>
                    <span className="hidden md:block">Meu Contrato Solar</span>
                  </h1>
                </div>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            <span className="block md:hidden">Gere contratos</span>
            <span className="block md:hidden">em poucos cliques</span>
            <span className="hidden md:block">Gere contratos em poucos cliques</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Contratos de energia solar personalizados, prontos rapidamente. Sem complicação.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Comece agora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Economize tempo
              </h3>
              <p className="text-gray-600">
                Automatize a geração de contratos e foque no que realmente importa
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Contratos profissionais
              </h3>
              <p className="text-gray-600">
                Documentos padronizados e completos, sempre atualizados
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                <MousePointer className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Simples como 1 clique
              </h3>
              <p className="text-gray-600">
                Interface intuitiva que qualquer pessoa pode usar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Pronto para simplificar sua geração de contratos?
          </h2>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            Criar conta gratuita
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500 text-sm">
            © 2025 SolarDocs. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}