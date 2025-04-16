import React from 'react';
import { useQuery } from 'react-query';
import { supabase } from '../lib/supabase';
import { Loader2, Trash2, Eye, PenSquare } from 'lucide-react';
import { format } from 'date-fns'; 
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';
import { generateContract } from '../utils/generateContract';
import { generatePowerOfAttorney } from '../utils/generatePowerOfAttorney';

interface HistoryViewProps {
  type: 'contract' | 'power-of-attorney';
  onSelect: () => void;
}

export default function HistoryView({ type, onSelect }: HistoryViewProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [, setFormProgress] = useAtom(formProgressAtom);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const { data: records, isLoading, refetch } = useQuery(
    ['history', type],
    async () => {
      const query = type === 'contract'
        ? supabase
            .from('customers')
            .select(`
              *,
              installation_locations(*),
              technical_configs(*),
              financial_terms(*)
            `)
            .order('created_at', { ascending: false })
        : supabase
            .from('power_of_attorney')
            .select(`
              id,
              full_name,
              cpf,
              rg,
              issuing_authority,
              street,
              number,
              neighborhood,
              city,
              state,
              created_at,
              user_id
            `)
            .order('created_at', { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      
      // Log the data for debugging
      console.log('Fetched records:', data);
      
      return data;
    }
  );

  const handlePreview = async (record: any) => {
    try {
      setIsGenerating(true);
      
      let blob;
      if (type === 'contract') {
        // Fetch all related data for contract preview
        const [locationRes, technicalRes, financialRes] = await Promise.all([
          supabase.from('installation_locations').select('*').eq('customer_id', record.id).maybeSingle(),
          supabase.from('technical_configs').select('*').eq('customer_id', record.id).maybeSingle(),
          supabase.from('financial_terms').select('*').eq('customer_id', record.id).maybeSingle()
        ]);

        let installments = [];
        if (financialRes.data?.id) {
          const { data: installmentsData } = await supabase
            .from('installments')
            .select('*')
            .eq('financial_terms_id', financialRes.data.id);
            
          if (installmentsData) {
            installments = installmentsData.map(inst => ({
              method: inst.method,
              amount: inst.amount,
              dueDate: new Date(inst.due_date)
            }));
          }
        }

        const data = {
          customerInfo: {
            fullName: record.full_name,
            cpf: record.cpf,
            rg: record.rg,
            issuingAuthority: record.issuing_authority,
            profession: record.profession,
            nationality: record.nationality,
            phone: record.phone,
            email: record.email,
            maritalStatus: record.marital_status
          },
          installationLocation: locationRes.data ? {
            street: locationRes.data.street,
            number: locationRes.data.number,
            neighborhood: locationRes.data.neighborhood,
            city: locationRes.data.city,
            state: locationRes.data.state,
            zipCode: locationRes.data.zip_code,
            utilityCode: locationRes.data.utility_code,
            utilityCompany: locationRes.data.utility_company,
            installationType: locationRes.data.installation_type
          } : undefined,
          technicalConfig: technicalRes.data ? {
            inverter1: {
              brand: technicalRes.data.inverter1_brand,
              power: technicalRes.data.inverter1_power,
              quantity: technicalRes.data.inverter1_quantity,
              warrantyPeriod: technicalRes.data.inverter1_warranty_period
            },
            inverter2: technicalRes.data.inverter2_brand ? {
              brand: technicalRes.data.inverter2_brand,
              power: technicalRes.data.inverter2_power,
              quantity: technicalRes.data.inverter2_quantity,
              warrantyPeriod: technicalRes.data.inverter2_warranty_period
            } : undefined,
            solarModules: {
              brand: technicalRes.data.solar_modules_brand,
              power: technicalRes.data.solar_modules_power,
              quantity: technicalRes.data.solar_modules_quantity
            },
            installationType: technicalRes.data.installation_type,
            installationDays: technicalRes.data.installation_days
          } : undefined,
          financialTerms: financialRes.data ? {
            totalAmount: financialRes.data.total_amount,
            installments
          } : undefined
        };
        
        blob = await generateContract(data);
      } else {
        // For power of attorney
        blob = await generatePowerOfAttorney({
          customerInfo: {
            fullName: record.full_name,
            cpf: record.cpf,
            rg: record.rg,
            issuingAuthority: record.issuing_authority,
            nationality: 'Brasileiro(a)',
            profession: '',
            phone: '',
            email: '',
            maritalStatus: 'Single'
          },
          installationLocation: {
            street: record.street,
            number: record.number,
            neighborhood: record.neighborhood,
            city: record.city,
            state: record.state,
            zipCode: '',
            utilityCode: '',
            utilityCompany: '',
            installationType: 'Residential'
          }
        });
      }

      // Open PDF in new tab
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error previewing document:', error);
      alert('Erro ao visualizar documento. Por favor, tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) {
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = type === 'contract'
        ? await supabase.from('customers').delete().eq('id', id)
        : await supabase.from('power_of_attorney').delete().eq('id', id);

      if (error) throw error;
      refetch();
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('Erro ao excluir registro');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectRecord = async (record: any) => {
    try {
      if (type === 'contract') {
        const [locationRes, technicalRes, financialRes] = await Promise.all([
          supabase.from('installation_locations').select('*').eq('customer_id', record.id).maybeSingle(),
          supabase.from('technical_configs').select('*').eq('customer_id', record.id).maybeSingle(),
          supabase.from('financial_terms').select('*').eq('customer_id', record.id).maybeSingle()
        ]);

        console.log('Fetched data:', { locationRes, technicalRes, financialRes });

        let installments = [];
        if (financialRes.data) {
          const { data: installmentsData } = await supabase
            .from('installments')
            .select('*')
            .eq('financial_terms_id', financialRes.data.id);
            
          console.log('Fetched installments:', installmentsData);

          if (installmentsData?.length) {
            installments = installmentsData.map(inst => ({
              method: inst.method,
              amount: inst.amount,
              dueDate: inst.due_date ? new Date(inst.due_date) : new Date()
            }));
          }
        }

        setFormProgress({
          currentStep: 'customer-info',
          completedSteps: [
            'customer-info',
            ...(locationRes.data ? ['installation-location'] : []),
            ...(technicalRes.data ? ['technical-config'] : []),
            ...(financialRes.data ? ['financial-terms'] : [])
          ],
          data: {
            customerId: record.id,
            customerInfo: {
              fullName: record.full_name,
              cpf: record.cpf,
              rg: record.rg,
              issuingAuthority: record.issuing_authority,
              profession: record.profession,
              nationality: record.nationality,
              phone: record.phone,
              email: record.email,
              maritalStatus: record.marital_status
            },
            installationLocation: locationRes.data ? {
              street: locationRes.data.street,
              number: locationRes.data.number,
              neighborhood: locationRes.data.neighborhood,
              city: locationRes.data.city,
              state: locationRes.data.state,
              zipCode: locationRes.data.zip_code,
              utilityCode: locationRes.data.utility_code,
              utilityCompany: locationRes.data.utility_company,
              installationType: locationRes.data.installation_type
            } : undefined,
            technicalConfig: technicalRes.data ? {
              inverter1: {
                brand: technicalRes.data.inverter1_brand,
                power: technicalRes.data.inverter1_power,
                quantity: technicalRes.data.inverter1_quantity,
                warrantyPeriod: technicalRes.data.inverter1_warranty_period
              },
              inverter2: technicalRes.data.inverter2_brand ? {
                brand: technicalRes.data.inverter2_brand,
                power: technicalRes.data.inverter2_power,
                quantity: technicalRes.data.inverter2_quantity,
                warrantyPeriod: technicalRes.data.inverter2_warranty_period
              } : undefined,
              solarModules: {
                brand: technicalRes.data.solar_modules_brand,
                power: technicalRes.data.solar_modules_power,
                quantity: technicalRes.data.solar_modules_quantity
              },
              installationType: technicalRes.data.installation_type,
              installationDays: technicalRes.data.installation_days
            } : undefined,
            financialTerms: financialRes.data ? {
              totalAmount: financialRes.data.total_amount,
              installments
            } : undefined,
            installationLocationId: locationRes.data?.id,
            technicalConfigId: technicalRes.data?.id,
            financialTermsId: financialRes.data?.id
          }
        });
        
        // Close history view and navigate to form
        onSelect();
      } else {
        setFormProgress({
          currentStep: null,
          completedSteps: [],
          data: {
            powerOfAttorney: {
              fullName: record.full_name,
              cpf: record.cpf,
              rg: record.rg,
              issuingAuthority: record.issuing_authority,
              street: record.street,
              number: record.number,
              neighborhood: record.neighborhood,
              city: record.city,
              state: record.state
            }
          }
        });
      }
      
      // Close history view in both cases
      onSelect();
    } catch (error) {
      console.error('Error loading record data:', error);
      alert('Erro ao carregar dados do registro');
    }
  };

  // Early return if no records
  if (!records || records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {type === 'contract' ? 'Histórico de Contratos' : 'Histórico de Procurações'}
        </h2>
        <p className="text-gray-500 text-center py-8">
          Nenhum registro encontrado.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {type === 'contract' ? 'Histórico de Contratos' : 'Histórico de Procurações'}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records?.map((record) => (
              <tr key={record.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.full_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {record.cpf}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(record.created_at), 'dd/MM/yyyy HH:mm')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => handlePreview(record)}
                      disabled={isGenerating}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(record.id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleSelectRecord(record)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <PenSquare className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}