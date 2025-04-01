import React from 'react';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { FileText, User, MapPin, Zap, DollarSign, Loader2, FileSignature } from 'lucide-react';
import { generateContract } from '../utils/generateContract';
import { generatePowerOfAttorney } from '../utils/generatePowerOfAttorney';

export default function ReviewForm() {
  const [formProgress] = useAtom(formProgressAtom);
  const [isGeneratingContract, setIsGeneratingContract] = React.useState(false);
  const [isGeneratingPowerOfAttorney, setIsGeneratingPowerOfAttorney] = React.useState(false);

  const handleGenerateContract = async () => {
    try {
      setIsGeneratingContract(true);
      const contractBlob = await generateContract(formProgress.data);
      
      // Create a download link
      const url = window.URL.createObjectURL(contractBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contrato-sistema-fotovoltaico.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating contract:', error);
      alert('Erro ao gerar contrato. Por favor, tente novamente.');
    } finally {
      setIsGeneratingContract(false);
    }
  };

  const handleGeneratePowerOfAttorney = async () => {
    try {
      setIsGeneratingPowerOfAttorney(true);
      const powerOfAttorneyBlob = await generatePowerOfAttorney(formProgress.data);
      
      // Create a download link
      const url = window.URL.createObjectURL(powerOfAttorneyBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'procuracao-sistema-fotovoltaico.pdf');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating power of attorney:', error);
      alert('Erro ao gerar procuração. Por favor, tente novamente.');
    } finally {
      setIsGeneratingPowerOfAttorney(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Revisão do Contrato</h2>

      <div className="space-y-6">
        {/* Customer Information */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Informações do Cliente
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CPF</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Telefone</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.phone}</p>
            </div>
          </div>
        </div>

        {/* Installation Location */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Local da Instalação
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Endereço</p>
              <p className="text-gray-900">
                {formProgress.data.installationLocation?.street}, {formProgress.data.installationLocation?.number}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
              <p className="text-gray-900">
                {formProgress.data.installationLocation?.city}/{formProgress.data.installationLocation?.state}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CEP</p>
              <p className="text-gray-900">{formProgress.data.installationLocation?.zipCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Código UC</p>
              <p className="text-gray-900">{formProgress.data.installationLocation?.utilityCode}</p>
            </div>
          </div>
        </div>

        {/* Technical Configuration */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Configuração Técnica
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Inversor Principal</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fabricante</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.inverter1.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Potência</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.inverter1.power} kW</p>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Módulos Solares</h4>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Fabricante</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.solarModules.brand}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantidade</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.solarModules.quantity} unidades</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Terms */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Termos Financeiros
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Valor Total</p>
              <p className="text-gray-900">
                R$ {formProgress.data.financialTerms?.totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Parcelas</p>
              <div className="mt-2 space-y-2">
                {formProgress.data.financialTerms?.installments.map((installment, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{installment.method}</span>
                    <span>R$ {installment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Documents Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={handleGeneratePowerOfAttorney}
            disabled={isGeneratingPowerOfAttorney}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGeneratingPowerOfAttorney ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Procuração...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Gerar Procuração
              </>
            )}
          </button>

          <button
            onClick={handleGenerateContract}
            disabled={isGeneratingContract}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isGeneratingContract ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Gerando Contrato...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Gerar Contrato
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}