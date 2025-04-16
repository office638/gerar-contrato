import React from 'react';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { paymentMethods, maritalStatusOptions } from '../types/form';
import { FileText, User, MapPin, Zap, DollarSign, Loader2, FileSignature, ArrowLeft, ExternalLink } from 'lucide-react';
import { generateContract } from '../utils/generateContract';
import { generatePowerOfAttorney } from '../utils/generatePowerOfAttorney';

export default function ReviewForm() {
  const [formProgress, setFormProgress] = useAtom(formProgressAtom);
  const [isGeneratingContract, setIsGeneratingContract] = React.useState(false);
  const [isGeneratingPowerOfAttorney, setIsGeneratingPowerOfAttorney] = React.useState(false);
  const [estadoLogin, setEstadoLogin] = React.useState(false);
  const [isAutomating, setIsAutomating] = React.useState(false);

  const handleSincetClick = () => {
    if (!estadoLogin) {
      alert("Faça login no sistema que será aberto em uma nova aba. Depois volte nesta aba e clique novamente no botão para iniciar o preenchimento automático.");
      window.open("https://servicos.sinceti.net.br/", "_blank");
      setEstadoLogin(true);
    } else {
      alert("Pressione as teclas Alt + L para ativar o fluxo e preencher automaticamente os dados no Sincet.");
      setEstadoLogin(false);
    }
  };

  const handleGenerateContract = async () => {
    try {
      setIsGeneratingContract(true);
      const contractBlob = await generateContract(formProgress.data);
      
      const url = window.URL.createObjectURL(contractBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contrato-sistema-fotovoltaico.pdf');
      document.body.appendChild(link);
      link.click();
      
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
      
      const url = window.URL.createObjectURL(powerOfAttorneyBlob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'procuracao-sistema-fotovoltaico.pdf');
      document.body.appendChild(link);
      link.click();
      
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
              <p className="text-sm font-medium text-gray-500">Estado Civil</p>
              <p className="text-gray-900">
                {maritalStatusOptions.find(
                  status => status.value === formProgress.data.customerInfo?.maritalStatus
                )?.translation || formProgress.data.customerInfo?.maritalStatus}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CPF</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.cpf}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">RG</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.rg}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Órgão Emissor</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.issuingAuthority}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Profissão</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.profession}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Nacionalidade</p>
              <p className="text-gray-900">{formProgress.data.customerInfo?.nationality}</p>
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
            <div>
              <p className="text-sm font-medium text-gray-500">Bairro</p>
              <p className="text-gray-900">{formProgress.data.installationLocation?.neighborhood}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Concessionária</p>
              <p className="text-gray-900">{formProgress.data.installationLocation?.utilityCompany}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Tipo de Instalação</p>
              <p className="text-gray-900">{formProgress.data.installationLocation?.installationType}</p>
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
                <div>
                  <p className="text-sm font-medium text-gray-500">Quantidade</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.inverter1.quantity}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Garantia (anos)</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.inverter1.warrantyPeriod}</p>
                </div>
              </div>
            </div>
            {formProgress.data.technicalConfig?.inverter2 && (
              <div>
                <h4 className="font-medium text-gray-700 mt-4">Inversor Secundário</h4>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fabricante</p>
                    <p className="text-gray-900">{formProgress.data.technicalConfig.inverter2.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Potência</p>
                    <p className="text-gray-900">{formProgress.data.technicalConfig.inverter2.power} kW</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Quantidade</p>
                    <p className="text-gray-900">{formProgress.data.technicalConfig.inverter2.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Garantia (anos)</p>
                    <p className="text-gray-900">{formProgress.data.technicalConfig.inverter2.warrantyPeriod}</p>
                  </div>
                </div>
              </div>
            )}
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
                <div>
                  <p className="text-sm font-medium text-gray-500">Potência</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.solarModules.power} W</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dias para Instalação</p>
                  <p className="text-gray-900">{formProgress.data.technicalConfig?.installationDays} dias</p>
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
                    <span>Parcela {index + 1} - {paymentMethods.find(m => m.value === installment.method)?.label}</span>
                    <div>
                      <span className="mr-4">R$ {installment.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      <span className="text-gray-500">Venc: {installment.dueDate.toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Documents Buttons */}
        <div className="flex flex-wrap gap-4 justify-between">
          <button
            type="button"
            onClick={() =>
              setFormProgress(prev => ({
                ...prev,
                currentStep: 'financial-terms'
              }))
            }
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </button>

          <div className="flex flex-col md:flex-row gap-4 ml-auto">
            <button
              onClick={handleSincetClick}
              disabled={isAutomating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center"
            >
              {isAutomating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Iniciando Fluxo...
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {estadoLogin ? "Confirmar Login e Iniciar Fluxo" : "Sincet"}
                </>
              )}
            </button>

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
    </div>
  );
}