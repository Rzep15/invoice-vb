import React from 'react';
import { Printer, Download, ArrowLeft, Phone, Mail, Instagram } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { InvoiceData } from '../App';

interface InvoicePreviewProps {
  invoiceData: InvoiceData;
  onBackToForm: () => void;
}

export default function InvoicePreview({ invoiceData, onBackToForm }: InvoicePreviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateSubtotal = () => {
    const packagePrice = invoiceData.selectedPackage?.price || 0;
    const additionalServicesTotal = invoiceData.additionalServices.reduce((total, service) => total + service.price, 0);
    return packagePrice + additionalServicesTotal;
  };

  const calculateDiscount = () => {
    const subtotal = calculateSubtotal();
    return Math.floor((subtotal * invoiceData.discountPercent) / 100);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount + invoiceData.shippingCost - invoiceData.dpAmount;
  };

  const calculateGrandTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    return subtotal - discount + invoiceData.shippingCost;
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    try {
      // Create a clone of the element with print styles applied
      const originalElement = element.cloneNode(true) as HTMLElement;
      
      // Create a temporary container with print styles
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      tempContainer.style.fontSize = '12px';
      tempContainer.style.lineHeight = '1.4';
      tempContainer.style.color = '#000000';
      
      // Apply print-specific styles to the cloned content
      const printStyles = `
        <style>
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box;
          }
          body, div, p, span, h1, h2, h3, h4, h5, h6 {
            font-family: system-ui, -apple-system, sans-serif !important;
            color: #000000 !important;
          }
          .bg-white { background-color: #ffffff !important; }
          .bg-gray-50 { background-color: #f9fafb !important; }
          .bg-gray-100 { background-color: #f3f4f6 !important; }
          .bg-green-100 { background-color: #dcfce7 !important; }
          .bg-red-100 { background-color: #fee2e2 !important; }
          .text-gray-900 { color: #111827 !important; }
          .text-gray-800 { color: #1f2937 !important; }
          .text-gray-700 { color: #374151 !important; }
          .text-gray-600 { color: #4b5563 !important; }
          .text-gray-500 { color: #6b7280 !important; }
          .text-green-800 { color: #166534 !important; }
          .text-red-800 { color: #991b1b !important; }
          .text-red-600 { color: #dc2626 !important; }
          .text-blue-600 { color: #2563eb !important; }
          .border-gray-200 { border-color: #e5e7eb !important; }
          .border-gray-300 { border-color: #d1d5db !important; }
          .rounded-lg { border-radius: 8px !important; }
          .rounded-full { border-radius: 50% !important; }
          .shadow-2xl { box-shadow: none !important; }
          .p-2 { padding: 8px !important; }
          .p-3 { padding: 12px !important; }
          .p-4 { padding: 16px !important; }
          .p-6 { padding: 24px !important; }
          .px-3 { padding-left: 12px !important; padding-right: 12px !important; }
          .px-4 { padding-left: 16px !important; padding-right: 16px !important; }
          .px-6 { padding-left: 24px !important; padding-right: 24px !important; }
          .py-1 { padding-top: 4px !important; padding-bottom: 4px !important; }
          .py-2 { padding-top: 8px !important; padding-bottom: 8px !important; }
          .py-4 { padding-top: 16px !important; padding-bottom: 16px !important; }
          .mb-2 { margin-bottom: 8px !important; }
          .mb-3 { margin-bottom: 12px !important; }
          .mb-4 { margin-bottom: 16px !important; }
          .mb-6 { margin-bottom: 24px !important; }
          .mt-1 { margin-top: 4px !important; }
          .mt-2 { margin-top: 8px !important; }
          .mt-4 { margin-top: 16px !important; }
          .pt-2 { padding-top: 8px !important; }
          .pt-3 { padding-top: 12px !important; }
          .border-b { border-bottom: 1px solid #e5e7eb !important; }
          .border-b-2 { border-bottom: 2px solid #e5e7eb !important; }
          .border-t { border-top: 1px solid #e5e7eb !important; }
          .border-t-2 { border-top: 2px solid #d1d5db !important; }
          .text-xs { font-size: 10px !important; }
          .text-sm { font-size: 11px !important; }
          .text-base { font-size: 12px !important; }
          .text-lg { font-size: 14px !important; }
          .text-xl { font-size: 16px !important; }
          .text-2xl { font-size: 18px !important; }
          .font-medium { font-weight: 500 !important; }
          .font-semibold { font-weight: 600 !important; }
          .font-bold { font-weight: 700 !important; }
          .text-left { text-align: left !important; }
          .text-center { text-align: center !important; }
          .text-right { text-align: right !important; }
          .flex { display: flex !important; }
          .items-center { align-items: center !important; }
          .justify-between { justify-content: space-between !important; }
          .space-x-2 > * + * { margin-left: 8px !important; }
          .space-x-4 > * + * { margin-left: 16px !important; }
          .space-y-2 > * + * { margin-top: 8px !important; }
          .grid { display: grid !important; }
          .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)) !important; }
          .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .gap-6 { gap: 24px !important; }
          .w-full { width: 100% !important; }
          .w-4 { width: 16px !important; }
          .w-12 { width: 48px !important; }
          .h-4 { height: 16px !important; }
          .h-12 { height: 48px !important; }
          .max-w-sm { max-width: 384px !important; }
          .max-w-4xl { max-width: 896px !important; }
          .mx-auto { margin-left: auto !important; margin-right: auto !important; }
          .overflow-hidden { overflow: hidden !important; }
          .overflow-x-auto { overflow-x: auto !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th, td { border: 1px solid #e5e7eb !important; }
          .border-collapse { border-collapse: collapse !important; }
          .object-contain { object-fit: contain !important; }
          .whitespace-pre-wrap { white-space: pre-wrap !important; }
          @media (min-width: 768px) {
            .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          }
        </style>
      `;
      
      tempContainer.innerHTML = printStyles + originalElement.outerHTML;
      document.body.appendChild(tempContainer);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        logging: false,
        onclone: (clonedDoc) => {
          // Apply exact print styles to cloned document
          const style = clonedDoc.createElement('style');
          style.textContent = `
            * {
              -webkit-print-color-adjust: exact !important;
              color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            body, div, p, span, h1, h2, h3, h4, h5, h6 {
              font-family: system-ui, -apple-system, sans-serif !important;
              font-size: 12px !important;
              line-height: 1.4 !important;
              color: #000000 !important;
            }
            .bg-white { background-color: #ffffff !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .bg-gray-100 { background-color: #f3f4f6 !important; }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .bg-red-100 { background-color: #fee2e2 !important; }
            .text-gray-900 { color: #111827 !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-gray-700 { color: #374151 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-green-800 { color: #166534 !important; }
            .text-red-800 { color: #991b1b !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-blue-600 { color: #2563eb !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .border-gray-300 { border-color: #d1d5db !important; }
            .shadow-2xl { box-shadow: none !important; }
            table { border-collapse: collapse !important; }
            th, td { 
              border: 1px solid #e5e7eb !important; 
              padding: 8px !important;
              font-size: 11px !important;
            }
          `;
          clonedDoc.head.appendChild(style);
        }
      });
      
      // Remove temporary container
      document.body.removeChild(tempContainer);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`Invoice-${invoiceData.invoiceNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat membuat PDF');
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center justify-between print:hidden">
        <button
          onClick={onBackToForm}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Form</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div id="invoice-content" className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://i.imgur.com/IJxCjEL.png" 
                alt="S2M Videobooth 360" 
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">S2M Videobooth 360</h1>
                <p className="text-gray-600 text-sm">Sewa Videobooth 360</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p className="text-gray-600 text-sm">#{invoiceData.invoiceNumber}</p>
              <div className={`mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
                invoiceData.paymentStatus === 'lunas' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {invoiceData.paymentStatus === 'lunas' ? '✓ LUNAS' : '⏳ BELUM LUNAS'}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-base font-semibold mb-3 text-gray-900">Informasi Perusahaan</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>0812-1111-4522</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4" />
                  <span>@s2m_videobooth360</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>official.s2mproduction@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-3 text-gray-900">Detail Invoice</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tanggal Invoice:</span>
                  <span className="font-medium">{formatDate(invoiceData.date)}</span>
                </div>
                {invoiceData.eventDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tanggal Event:</span>
                    <span className="font-medium">{formatDate(invoiceData.eventDate)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Info */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 text-gray-900">Kepada</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900">{invoiceData.customerName}</h4>
              {invoiceData.customerPhone && <p className="text-sm text-gray-600">{invoiceData.customerPhone}</p>}
              {invoiceData.customerAddress && <p className="text-sm text-gray-600">{invoiceData.customerAddress}</p>}
              {invoiceData.eventLocation && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-medium">Jenis Event:</span> {invoiceData.eventLocation}
                </p>
              )}
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 text-gray-900">Detail Layanan</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 border-b font-semibold text-gray-800 text-sm">Deskripsi</th>
                    <th className="text-center p-2 border-b font-semibold text-gray-800 text-sm">Durasi</th>
                    <th className="text-right p-2 border-b font-semibold text-gray-800 text-sm">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.selectedPackage && (
                    <tr>
                      <td className="p-2 border-b">
                        <div>
                          <span className="font-medium text-sm">🌟 Paket {invoiceData.selectedPackage.name}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            Sewa Videobooth 360 
                          </div>
                        </div>
                      </td>
                      <td className="p-2 border-b text-center text-sm">{invoiceData.selectedPackage.duration}</td>
                      <td className="p-2 border-b text-right font-medium text-sm">
                        {formatCurrency(invoiceData.selectedPackage.price)}
                      </td>
                    </tr>
                  )}
                  
                  {invoiceData.additionalServices.map((service, index) => (
                    <tr key={index}>
                      <td className="p-2 border-b">
                        <span className="font-medium text-sm">{service.name}</span>
                      </td>
                      <td className="p-2 border-b text-center text-sm">-</td>
                      <td className="p-2 border-b text-right font-medium text-sm">
                        {formatCurrency(service.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6">
            <div className="w-full max-w-sm">
              <div className="space-y-2">
                <div className="flex justify-between py-1 border-b text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                
                {invoiceData.discountPercent > 0 && (
                  <div className="flex justify-between py-1 border-b text-red-600 text-sm">
                    <span>Diskon ({invoiceData.discountPercent}%):</span>
                    <span className="font-medium">-{formatCurrency(calculateDiscount())}</span>
                  </div>
                )}
                
                {invoiceData.shippingCost > 0 && (
                  <div className="flex justify-between py-1 border-b text-sm">
                    <span className="text-gray-600">Ongkos Kirim:</span>
                    <span className="font-medium">{formatCurrency(invoiceData.shippingCost)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-1 border-b text-sm">
                  <span className="text-gray-600">Total Keseluruhan:</span>
                  <span className="font-medium">{formatCurrency(calculateGrandTotal())}</span>
                </div>
                
                {invoiceData.dpAmount > 0 && (
                  <div className="flex justify-between py-1 border-b text-blue-600 text-sm">
                    <span>DP (Down Payment):</span>
                    <span className="font-medium">-{formatCurrency(invoiceData.dpAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-t-2 border-gray-300">
                  <span className="text-base font-semibold">
                    {invoiceData.dpAmount > 0 ? 'Sisa Pembayaran:' : 'Total:'}
                  </span>
                  <span className="text-base font-bold text-gray-900">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <h3 className="text-base font-semibold mb-2 text-gray-900">Catatan</h3>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 mb-2">
                Pelunasan dilakukan paling lambat H-1 sebelum acara
              </p>
              {invoiceData.notes && (
                <p className="text-sm text-gray-700 whitespace-pre-wrap border-t pt-2">
                  {invoiceData.notes}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-3 mt-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Terima kasih telah mempercayakan acara Anda kepada S2M Videobooth 360
              </p>
              <p className="text-xs text-gray-500">
                Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}