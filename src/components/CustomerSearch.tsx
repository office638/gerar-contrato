import React from 'react';
import { useQuery } from 'react-query';
import { Search, Loader2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAtom } from 'jotai';
import { formProgressAtom } from '../store/form';

async function deleteCustomer(customerId: string) {
  try {
    const { error: custError } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);
    
    if (custError) throw custError;
    return true;
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    throw new Error(error.message || 'Failed to delete customer');
  }
}

export default function CustomerSearch() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [, setFormProgress] = useAtom(formProgressAtom);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const { data: customers, isLoading } = useQuery(
    ['customers', searchTerm],
    async () => {
      if (!searchTerm) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`full_name.ilike.%${searchTerm}%,cpf.ilike.%${searchTerm}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    {
      enabled: searchTerm.length > 2,
      keepPreviousData: true
    }
  );

  const handleSelectCustomer = async (customer: any) => {
    try {
      // Fetch all related data using maybeSingle() instead of single()
      const [locationRes, technicalRes, financialRes] = await Promise.all([
        supabase.from('installation_locations').select('*').eq('customer_id', customer.id).maybeSingle(),
        supabase.from('technical_configs').select('*').eq('customer_id', customer.id).maybeSingle(),
        supabase.from('financial_terms').select('*').eq('customer_id', customer.id).maybeSingle()
      ]);

      let installments = [];
      // Only fetch installments if we have a valid financial terms ID
      if (financialRes.data?.id) {
        const { data: installmentsData, error: installmentsError } = await supabase
          .from('installments')
          .select('*')
          .eq('financial_terms_id', financialRes.data.id);
          
        if (!installmentsError && installmentsData) {
          installments = installmentsData.map(inst => ({
            method: inst.method,
            amount: inst.amount,
            dueDate: new Date(inst.due_date)
          }));
        }
      }

      setFormProgress(prev => ({
        ...prev,
        currentStep: 'customer-info',
        completedSteps: [],
        data: {
          customerId: customer.id,
          customerInfo: {
            fullName: customer.full_name,
            cpf: customer.cpf,
            rg: customer.rg,
            issuingAuthority: customer.issuing_authority,
            profession: customer.profession,
            nationality: customer.nationality,
            phone: customer.phone,
            email: customer.email,
            maritalStatus: customer.marital_status
          },
          // Only set location data if it exists
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
          // Only set technical config if it exists
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
          // Only set financial terms if they exist
          financialTerms: financialRes.data ? {
            totalAmount: financialRes.data.total_amount,
            installments
          } : undefined,
        }
      }));
      
      // Update completed steps based on available data
      setFormProgress(prev => ({
        ...prev,
        completedSteps: [
          'customer-info',
          ...(locationRes.data ? ['installation-location'] : []),
          ...(technicalRes.data ? ['technical-config'] : []),
          ...(financialRes.data ? ['financial-terms'] : [])
        ]
      }));

    } catch (error) {
      console.error('Error loading customer data:', error);
    }
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleDeleteCustomer = async (customer: any, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir o cadastro de ${customer.full_name}? Esta ação não pode ser desfeita.`)) {
      setIsDeleting(true);
      try {
        await deleteCustomer(customer.id);
        setSearchTerm(''); // Reset search to refresh list
      } catch (error: any) {
        alert(`Erro ao excluir cliente: ${error.message}`);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowDropdown(true);
          }}
          placeholder="Buscar cliente..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        {isLoading && (
          <Loader2 className="absolute right-3 top-2.5 h-5 w-5 text-blue-500 animate-spin" />
        )}
      </div>

      {showDropdown && customers && customers.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200">
          {customers.map((customer) => (
            <button
              key={customer.id}
              onClick={() => handleSelectCustomer(customer)}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{customer.full_name}</div>
                  <div className="text-sm text-gray-500">{customer.cpf}</div>
                </div>
                <button
                  onClick={(e) => handleDeleteCustomer(customer, e)}
                  disabled={isDeleting}
                  className="p-2 text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}