import { jsPDF } from 'jspdf';
import { FormProgress } from '../types/form';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export async function generatePowerOfAttorney(formData: FormProgress['data']): Promise<Blob> {
  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set default font
  doc.setFont('helvetica');
  
  // Helper function for multiline text
  const addMultiLineText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * (fontSize * 0.65));
  };

  // Start generating the power of attorney
  let yPos = 20;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0); // Set text color to black
  doc.text('AUTORIZAÇÃO DE REPRESENTAÇÃO TÉCNICA', 105, yPos, { align: 'center' });
  yPos += 30;

  // Main text
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0); // Ensure text color is black
  
  const mainText = `Eu, ${formData.customerInfo?.fullName}, portador(a) do CPF ${formData.customerInfo?.cpf}, residente em ${formData.installationLocation?.street}, ${formData.installationLocation?.number} - ${formData.installationLocation?.neighborhood}, ${formData.installationLocation?.city}/${formData.installationLocation?.state}, Autorizo o TÉCNICO EM ELETROTÉCNICA Diogo Castro Alves Rodrigues, com Registro Nacional no CRT-01: 03828143121 e Processo de Registro: 50641282023, a me representar junto à concessionária, ${formData.installationLocation?.utilityCompany || ''}, para tratar de assuntos relacionados ao acesso de geração distribuída.`;

  yPos = addMultiLineText(mainText, 20, yPos, 170);
  yPos += 40;

  // Date
  const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  doc.text(`${formData.installationLocation?.city}, ${currentDate}`, 105, yPos, { align: 'center' });
  yPos += 40;

  // Signature lines
  doc.line(20, yPos, 90, yPos);
  doc.line(115, yPos, 185, yPos);
  yPos += 10;

  // Signature texts
  doc.setFontSize(10);
  doc.text('Diogo Castro Alves Rodrigues', 55, yPos, { align: 'center' });
  doc.text(formData.customerInfo?.fullName || '', 150, yPos, { align: 'center' });
  yPos += 5;

  doc.text('REGISTRO NACIONAL: 03828143121', 55, yPos, { align: 'center' });
  doc.text(`CPF: ${formData.customerInfo?.cpf}`, 150, yPos, { align: 'center' });
  yPos += 5;

  doc.text('PROCESSO DE REGISTRO: 50641282023', 55, yPos, { align: 'center' });
  yPos += 5;

  doc.text('Rua Dom Pedro II,800, Centro, Santa Rita', 55, yPos, { align: 'center' });
  yPos += 5;

  doc.text('do Pardo – MS, Cep: 79690-000', 55, yPos, { align: 'center' });

  return doc.output('blob');
}
