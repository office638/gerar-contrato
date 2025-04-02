import * as XLSX from 'xlsx';
import { FormProgress } from '../types/form';

export const generateExcelTemplate = () => {
  const template = {
    'Informações do Cliente': [
      {
        'Nome Completo': '',
        'Estado Civil': 'Single/Married/Divorced/Widowed',
        'CPF': '000.000.000-00',
        'RG': '',
        'Órgão Emissor': '',
        'Profissão': '',
        'Nacionalidade': 'Brasileiro(a)',
        'Telefone': '(00) 00000-0000',
        'Email': ''
      }
    ],
    'Local da Instalação': [
      {
        'Rua': '',
        'Número': '',
        'Bairro': '',
        'Cidade': '',
        'Estado': 'SP',
        'CEP': '00000-000',
        'Concessionária': '',
        'Tipo de Instalação': 'Residential/Commercial/Industrial'
      }
    ],
    'Configuração Técnica': [
      {
        'Marca do Inversor': '',
        'Potência do Inversor (kW)': 0,
        'Quantidade de Inversores': 1,
        'Período de Garantia (anos)': 10,
        'Marca dos Módulos': '',
        'Potência dos Módulos (W)': 0,
        'Quantidade de Módulos': 0,
        'Tipo de Instalação': 'Ground/Roof/Other',
        'Dias para Instalação': 30
      }
    ],
    'Termos Financeiros': [
      {
        'Método de Pagamento': 'Transfer/BankSlip/Pix/Financing',
        'Valor': 0,
        'Data de Vencimento': '2024-01-01'
      }
    ]
  };

  const wb = XLSX.utils.book_new();
  
  Object.entries(template).forEach(([sheetName, data]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  return XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
};

export const parseExcelData = (buffer: ArrayBuffer): FormProgress['data'] => {
  const wb = XLSX.read(buffer, { type: 'array' });
  
  const getSheetData = (sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(ws)[0] as any;
  };

  const customerInfo = getSheetData('Informações do Cliente');
  const location = getSheetData('Local da Instalação');
  const technical = getSheetData('Configuração Técnica');
  const financial = getSheetData('Termos Financeiros');

  return {
    customerInfo: {
      fullName: customerInfo['Nome Completo'],
      maritalStatus: customerInfo['Estado Civil'],
      cpf: customerInfo['CPF'],
      rg: customerInfo['RG'],
      issuingAuthority: customerInfo['Órgão Emissor'],
      profession: customerInfo['Profissão'],
      nationality: customerInfo['Nacionalidade'],
      phone: customerInfo['Telefone'],
      email: customerInfo['Email']
    },
    installationLocation: {
      street: location['Rua'],
      number: location['Número'],
      neighborhood: location['Bairro'],
      city: location['Cidade'],
      state: location['Estado'],
      zipCode: location['CEP'],
      utilityCompany: location['Concessionária'],
      installationType: location['Tipo de Instalação']
    },
    technicalConfig: {
      inverter1: {
        brand: technical['Marca do Inversor'],
        power: technical['Potência do Inversor (kW)'],
        quantity: technical['Quantidade de Inversores'],
        warrantyPeriod: technical['Período de Garantia (anos)']
      },
      solarModules: {
        brand: technical['Marca dos Módulos'],
        power: technical['Potência dos Módulos (W)'],
        quantity: technical['Quantidade de Módulos']
      },
      installationType: technical['Tipo de Instalação'],
      installationDays: technical['Dias para Instalação']
    },
    financialTerms: {
      installments: [{
        method: financial['Método de Pagamento'],
        amount: financial['Valor'],
        dueDate: new Date(financial['Data de Vencimento'])
      }],
      totalAmount: financial['Valor']
    }
  };
};
