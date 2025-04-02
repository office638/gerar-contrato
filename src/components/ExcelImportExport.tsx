import React from 'react';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { generateExcelTemplate, parseExcelData } from '../utils/excelUtils';
import { FileDown, FileUp, Loader2 } from 'lucide-react';

export default function ExcelImportExport() {
  const [, setFormProgress] = useAtom(formProgressAtom);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleDownloadTemplate = () => {
    const buffer = generateExcelTemplate();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template-contrato-solar.xlsx');
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const data = parseExcelData(buffer);
      
      setFormProgress(prev => ({
        ...prev,
        currentStep: 'review',
        completedSteps: ['customer-info', 'installation-location', 'technical-config', 'financial-terms'],
        data
      }));
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      alert('Erro ao processar o arquivo. Verifique se está usando o template correto.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex gap-4 items-center">
      <button
        onClick={handleDownloadTemplate}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center"
      >
        <FileDown className="w-4 h-4 mr-2" />
        Baixar Template
      </button>

      <label className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer flex items-center">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isProcessing}
        />
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <FileUp className="w-4 h-4 mr-2" />
            Importar Excel
          </>
        )}
      </label>
    </div>
  );
}
