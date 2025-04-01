// generateContract.ts

import { jsPDF } from 'jspdf';
import { FormProgress } from '../types/form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { contractTemplate } from './contractTemplate';

export async function generateContract(formData: FormProgress['data']): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica');

  const cleanContent = (text: string) =>
    text.replace(/\n{2,}/g, '\n').replace(/\n(?=\d+\s?-\s?[A-Z])/, '').trim();

  const addMultiLineText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 10
  ) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text.trim().replace(/\n{2,}/g, '\n'), maxWidth);
    const lineHeight = fontSize * 0.6;
    lines.forEach((line, index) => {
      doc.text(line, x, y + index * lineHeight);
    });
    return y + lines.length * lineHeight;
  };

  const addSection = (title: string, content: string, yPos: number, fontSize = 10) => {
    doc.setFontSize(fontSize + 2);
    doc.setFont('helvetica', 'bold');
    yPos = addMultiLineText(title, 20, yPos, 170, fontSize + 2);
    yPos += 3;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize);
    yPos = addMultiLineText(cleanContent(content), 20, yPos, 170, fontSize);
    return yPos + 5;
  };

  const addPage = () => {
    doc.addPage();
    return 20;
  };

  // Payment method translation map
  const paymentMethodTranslation: Record<string, string> = {
    'Transfer': 'Transferência',
    'BankSlip': 'Boleto',
    'Pix': 'Pix',
    'Financing': 'Financiamento'
  };

  let yPos = 20;
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE PRESTAÇÃO DE SERVIÇOS', 105, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(12);
  doc.text('IDENTIFICAÇÃO DAS PARTES CONTRATADAS', 105, yPos, { align: 'center' });
  yPos += 15;

  const companyInfo = `CONTRATADA: ECOENERGI SOLAR, PESSOA JURÍDICA DE DIREITO PRIVADO, INSCRITA NO CNPJ SOB O N° 12.276.329.0001-69, COM SEDE NA RUA DEPUTADO JÚLIO CÉSAR PAULINO MAIA - N°1410S- CENTRO, NA CIDADE DE SANTA RITA DO PARDO - MS, COM CEP: 79690-000, NESTE ATO REPRESENTADA POR DIOGO CASTRO ALVES RODRIGUES, INSCRITO NO CPF SOB O N° 058.281.431-21.`;
  yPos = addMultiLineText(companyInfo, 20, yPos, 170);
  yPos += 4;

  const clientInfo = `CONTRATANTE: ${formData.customerInfo?.fullName}, portador(a) do CPF ${formData.customerInfo?.cpf} e RG ${formData.customerInfo?.rg} ${formData.customerInfo?.issuingAuthority}, ${formData.customerInfo?.nationality}, ${formData.customerInfo?.profession}, residente e domiciliado(a) em ${formData.installationLocation?.street}, ${formData.installationLocation?.number}, ${formData.installationLocation?.neighborhood}, ${formData.installationLocation?.city}/${formData.installationLocation?.state}, CEP ${formData.installationLocation?.zipCode}, telefone ${formData.customerInfo?.phone}, email ${formData.customerInfo?.email}.`;

  yPos = addMultiLineText(clientInfo, 20, yPos, 170);
  yPos += 6;

  const systemPower = (
    ((formData.technicalConfig?.solarModules.power || 0) *
      (formData.technicalConfig?.solarModules.quantity || 0)) /
    1000
  ).toFixed(2);
  const objectContent = `1.1 A CONTRATADA compromete-se a prestar os serviços de instalação do sistema fotovoltaico, bem como tratativas com a concessionária de distribuição de energia elétrica. O sistema presente tem como potência ${systemPower}kWp (Quilo Watts Pico).

Dentre os principais materiais estão inclusos:
- ${formData.technicalConfig?.inverter1.quantity} Inversor(es) ${formData.technicalConfig?.inverter1.brand} de ${formData.technicalConfig?.inverter1.power}kW de Potência de Saída
- ${formData.technicalConfig?.solarModules.quantity} Módulos Solares ${formData.technicalConfig?.solarModules.brand} ${formData.technicalConfig?.solarModules.power}W de Potência
- Estrutura para fixação dos módulos instalados em ${formData.technicalConfig?.installationType === 'Roof' ? 'Telhado' : 'Solo'}`;
  yPos = addSection('1 - DO OBJETO DO PRESENTE CONTRATO', objectContent, yPos);

  if (yPos > 250) yPos = addPage();

  // Generate payment terms based on number of installments
  const installments = formData.financialTerms?.installments || [];
  let paymentTerms = '';

  if (installments.length === 1) {
    paymentTerms = `Pagamento único no valor de R$ ${installments[0].amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a ser pago via ${paymentMethodTranslation[installments[0].method]} com vencimento em ${format(installments[0].dueDate, 'dd/MM/yyyy')}.`;
  } else {
    paymentTerms = installments.map((inst, index) =>
      `Parcela ${index + 1}: R$ ${inst.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} via ${paymentMethodTranslation[inst.method]} com vencimento em ${format(inst.dueDate, 'dd/MM/yyyy')}`
    ).join('\n');
  }

  const priceContent = `2.1 O CONTRATANTE pagará à CONTRATADA, pelos serviços descritos na cláusula primeira deste compromisso, a quantia de R$ ${formData.financialTerms?.totalAmount?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}, referentes aos materiais, mão de obra, engenharia, serviços de projetos e aprovações.

2.2 Fica acordado o pagamento nas seguintes condições:
${paymentTerms}

2.3 O não cumprimento pelo CONTRATANTE das datas e prazos avençados nesta cláusula o constituirá em mora, independentemente de interpelação da CONTRATADA, nos termos do artigo 397 do Código Civil. Ainda, acarretará à CONTRATANTE multa equivalente a 2% do valor total, acrescidos de juros de mora de 3% ao mês, contados a partir do inadimplemento da obrigação.

2.4 Quaisquer taxas, custas, ou acréscimos que surjam em decorrência de alteração da avença acima, ou de prazos de boletos, ou mesmo de renegociações, serão de responsabilidade do CONTRATANTE.`;
  yPos = addSection('2 - PREÇO E FORMA DE PAGAMENTO', priceContent, yPos);

  Object.entries(contractTemplate.clauses).forEach(([key, content]) => {
    if (!['object', 'price'].includes(key)) {
      if (yPos > 250) yPos = addPage();
      yPos = addSection(content.split('\n')[0].trim(), cleanContent(content), yPos);
    }
  });

  if (yPos > 190) yPos = addPage();
  else yPos += 10;

  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  doc.text(`${formData.installationLocation?.city}, ${currentDate}`, 105, yPos, { align: 'center' });

  yPos += 20;
  doc.line(20, yPos, 90, yPos);
  doc.line(115, yPos, 185, yPos);
  doc.setFontSize(10);
  doc.text('ECOENERGI SOLAR', 55, yPos + 10, { align: 'center' });
  doc.text(formData.customerInfo?.fullName || '', 150, yPos + 10, { align: 'center' });
  doc.text('CNPJ: 12.276.329.0001-69', 55, yPos + 15, { align: 'center' });
  doc.text(`CPF: ${formData.customerInfo?.cpf}`, 150, yPos + 15, { align: 'center' });

  yPos += 30;
  doc.text('TESTEMUNHAS:', 20, yPos);
  doc.line(20, yPos + 10, 90, yPos + 10);
  doc.line(115, yPos + 10, 185, yPos + 10);
  doc.text('Nome:', 20, yPos + 15);
  doc.text('Nome:', 115, yPos + 15);
  doc.text('CPF:', 20, yPos + 20);
  doc.text('CPF:', 115, yPos + 20);

  return doc.output('blob');
}
