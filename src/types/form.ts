import { z } from 'zod';

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type CustomerInfo = {
  fullName: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | '';
  cpf: string;
  rg: string;
  issuingAuthority: string;
  profession: string;
  nationality: string;
  phone: string;
  email: string;
};

export type MaritalStatus = {
  value: CustomerInfo['maritalStatus'];
  label: string;
  translation?: string;
};

export const maritalStatusOptions: MaritalStatus[] = [
  { value: 'Single', label: 'Solteiro(a)', translation: 'Solteiro(a)' },
  { value: 'Married', label: 'Casado(a)', translation: 'Casado(a)' },
  { value: 'Divorced', label: 'Divorciado(a)', translation: 'Divorciado(a)' },
  { value: 'Widowed', label: 'Viúvo(a)', translation: 'Viúvo(a)' }
];

export type InstallationLocation = {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  utilityCode: string;
  utilityCompany: string;
  installationType: 'Residential' | 'Commercial' | 'Industrial' | 'Rural';
};

export type Inverter = {
  brand: string;
  power: number;
  quantity: number;
  warrantyPeriod: number;
};

export type SolarModule = {
  brand: string;
  power: number;
  quantity: number;
};

export type TechnicalConfig = {
  inverter1: Inverter;
  inverter2?: Inverter;
  solarModules: SolarModule;
  installationType: 'Ground' | 'Roof' | 'Other';
  otherTypeDescription?: string;
  installationDays: number;
};

export type PaymentMethod = 
  | 'Transferência'
  | 'Boleto'
  | 'Pix'
  | 'Financiamento';

export type PaymentInstallment = {
  method: PaymentMethod;
  amount: number;
  dueDate: Date;
};

export type FinancialTerms = {
  installments: PaymentInstallment[];
  totalAmount: number;
};

export type FormStep = 
  | 'customer-info' 
  | 'installation-location' 
  | 'technical-config' 
  | 'financial-terms' 
  | 'review';

export type FormProgress = {
  currentStep: FormStep;
  completedSteps: FormStep[];
  data: {
    customerId?: string;
    installationLocationId?: string;
    technicalConfigId?: string;
    financialTermsId?: string;
    customerInfo?: CustomerInfo;
    installationLocation?: InstallationLocation;
    technicalConfig?: TechnicalConfig;
    financialTerms?: FinancialTerms;
    powerOfAttorney?: any;
  };
};

// Validation schemas
export const customerInfoSchema = z.object({
  fullName: z.string().min(3).max(100),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed', '']).optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  rg: z.string().max(20),
  issuingAuthority: z.string().max(50),
  profession: z.string().max(100),
  nationality: z.string().default('Brasileiro(a)'),
  phone: z.string().regex(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
  email: z.string().email('Email inválido')
});

export const installationLocationSchema = z.object({
  street: z.string().min(3).max(200),
  number: z.string().max(20),
  neighborhood: z.string().max(100),
  city: z.string().max(100),
  state: z.enum(brazilianStates as unknown as [string, ...string[]]),
  zipCode: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  utilityCode: z.string().max(20),
  utilityCompany: z.string().min(1, 'Nome da concessionária é obrigatório'),
  installationType: z.enum(['Residential', 'Commercial', 'Industrial', 'Rural'])
});

export const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: 'Transferência', label: 'Transferência' },
  { value: 'Boleto', label: 'Boleto' },
  { value: 'Pix', label: 'Pix' },
  { value: 'Financiamento', label: 'Financiamento' },
];

export const installationTypes = [
  { value: 'Residential', label: 'Residencial' },
  { value: 'Commercial', label: 'Comercial' },
  { value: 'Industrial', label: 'Industrial' },
  { value: 'Rural', label: 'Rural' },
] as const;

export const mountTypes = [
  { value: 'Ground', label: 'Solo' },
  { value: 'Roof', label: 'Telhado' },
  { value: 'Other', label: 'Outro' },
] as const;

export const inverterBrands = [
  'Growatt',
  'Deye',
  'Solis',
  'SAJ',
  'Solplanet',
  'Sofar',
  'Sungrow',
  'Fronius',
  'WEG',
  'Huawei',
  'Hoymiles',
  'PHB Solar',
  'GoodWe',
  'APSystems',
  'Canadian Solar',
  'Intelbras',
  'Solar Edge',
  'Livoltek',
  'Enphase',
  'BelEnergy'
] as const;

export const solarModuleBrands = [
  'Astronergy',
  'BYD',
  'Canadian Solar',
  'Dah Solar',
  'ET Solar',
  'Era Solar',
  'Helius',
  'Heliene',
  'Honor Solar',
  'Huasun',
  'JA Solar',
  'Jinko Solar',
  'LONGi',
  'Leapton',
  'Luxen Solar',
  'Neo Solar',
  'NeoSolar',
  'Osda',
  'Osda Solar',
  'Phono Solar',
  'QCells',
  'Q CELLS',
  'REC Solar',
  'Renepv',
  'Risen',
  'Risen Energy',
  'Seraphim',
  'Sunova',
  'Sunergy',
  'Suntech',
  'Trina',
  'Trina Solar',
  'Tsun Solar',
  'Ulica',
  'Ulica Solar',
  'Yingli',
  'Yingli Solar',
  'ZNShine',
  'ZNShine Solar',
  'Eco Solys',
  'AE Solar',
  'Bluesun',
  'Boviet Solar',
  'GCL System',
  'HT-SAAE',
  'Innova Solar'
] as const;