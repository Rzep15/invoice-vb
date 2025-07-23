import React from 'react';
import { Printer, Download, ArrowLeft, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';
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
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      
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

  const handleSendWhatsApp = () => {
    const packageName = invoiceData.selectedPackage?.name || '';
    const total = formatCurrency(calculateTotal());
    const grandTotal = formatCurrency(calculateGrandTotal());
    const eventDate = formatDate(invoiceData.eventDate);
    
    let message = `🎬 *INVOICE S2M VIDEOBOOTH 360*\n`;
    message += `═══════════════════════════════════════\n\n`;
    message += `📋 *Invoice:* ${invoiceData.invoiceNumber}\n`;
    message += `👤 *Customer:* ${invoiceData.customerName}\n`;
    if (eventDate !== '-') {
      message += `📅 *Tanggal Event:* ${eventDate}\n`;
    }
    if (invoiceData.eventLocation) {
      message += `🎯 *Jenis Event:* ${invoiceData.eventLocation}\n`;
    }
    message += `\n`;
    
    message += `📦 *DETAIL LAYANAN*\n`;
    message += `───────────────────────────────────────\n`;
    message += `🌟 Paket ${packageName} (${invoiceData.selectedPackage?.duration})\n`;
    message += `   ${formatCurrency(invoiceData.selectedPackage?.price || 0)}\n`;
    
    if (invoiceData.additionalServices.length > 0) {
      invoiceData.additionalServices.forEach(service => {
        message += `➕ ${service.name}\n   ${formatCurrency(service.price)}\n`;
      });
    }
    
    message += `\n💰 *RINGKASAN PEMBAYARAN*\n`;
    message += `───────────────────────────────────────\n`;
    message += `Subtotal: ${formatCurrency(calculateSubtotal())}\n`;
    
    if (invoiceData.discountPercent > 0) {
      message += `Diskon (${invoiceData.discountPercent}%): -${formatCurrency(calculateDiscount())}\n`;
    }
    
    if (invoiceData.shippingCost > 0) {
      message += `Ongkos Kirim: ${formatCurrency(invoiceData.shippingCost)}\n`;
    }
    
    message += `───────────────────────────────────────\n`;
    message += `*TOTAL KESELURUHAN: ${grandTotal}*\n`;
    
    if (invoiceData.dpAmount > 0) {
      message += `DP Dibayar: -${formatCurrency(invoiceData.dpAmount)}\n`;
      message += `*SISA PEMBAYARAN: ${total}*\n`;
    }
    
    message += `\n📊 *Status:* ${invoiceData.paymentStatus === 'lunas' ? '✅ LUNAS' : '⏳ BELUM LUNAS'}\n\n`;
    
    if (invoiceData.notes) {
      message += `📝 *CATATAN*\n`;
      message += `───────────────────────────────────────\n`;
      message += `${invoiceData.notes}\n\n`;
    }
    
    message += `📞 *KONTAK KAMI*\n`;
    message += `───────────────────────────────────────\n`;
    message += `📱 0812-1111-4522\n`;
    message += `📸 @s2m_videobooth360\n`;
    message += `📧 official.s2mproduction@gmail.com\n\n`;
    message += `Terima kasih telah mempercayakan acara Anda kepada *S2M Videobooth 360*\n`;
    message += `Siap membuat momen berharga Anda tak terlupakan! 🎉`;
    
    const phoneNumber = invoiceData.customerPhone?.replace(/\D/g, '') || '';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
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
          <button
            onClick={handleSendWhatsApp}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Invoice */}
      <div id="invoice-content" className="bg-white text-gray-900 rounded-lg shadow-2xl overflow-hidden max-w-4xl mx-auto print:shadow-none print:max-w-none">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-200 px-6 py-6 print:py-3 print:px-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://i.imgur.com/IJxCjEL.png" 
                alt="S2M Videobooth 360" 
                className="h-16 w-16 object-contain print:h-10 print:w-10"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 print:text-lg">S2M Videobooth 360</h1>
                <p className="text-gray-600 text-sm print:text-sm">Sewa Videobooth 360</p>
              </div>
            </div>
            <div className="text-right flex flex-col items-end">
              <h2 className="text-3xl font-bold text-gray-900 print:text-xl">INVOICE</h2>
              <p className="text-gray-600 text-sm print:text-sm">{invoiceData.invoiceNumber}</p>
              <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold print:mt-1 ${
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
        <div className="px-6 py-6 print:py-3 print:px-3">
          {/* Invoice Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 print:gap-3 print:mb-3">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 print:text-sm print:mb-2">Informasi Perusahaan</h3>
              <div className="space-y-2 text-sm text-gray-600 print:text-xs print:space-y-1">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 print:h-3 print:w-3" />
                  <span>0812-1111-4522</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4 print:h-3 print:w-3" />
                  <span>@s2m_videobooth360</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 print:h-3 print:w-3" />
                  <span>official.s2mproduction@gmail.com</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 print:text-sm print:mb-2">Detail Invoice</h3>
              <div className="space-y-2 text-sm print:text-xs print:space-y-1">
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
          <div className="mb-6 print:mb-3">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 print:text-sm print:mb-2">Kepada</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:p-2">
              <h4 className="font-semibold text-gray-900">{invoiceData.customerName}</h4>
              {invoiceData.customerPhone && <p className="text-sm text-gray-600 print:text-xs">{invoiceData.customerPhone}</p>}
              {invoiceData.customerAddress && <p className="text-sm text-gray-600 print:text-xs">{invoiceData.customerAddress}</p>}
              {invoiceData.eventLocation && (
                <p className="text-sm text-gray-600 mt-2 print:text-xs print:mt-1">
                  <span className="font-medium">Jenis Event:</span> {invoiceData.eventLocation}
                </p>
              )}
            </div>
          </div>

          {/* Services Table */}
          <div className="mb-6 print:mb-3">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 print:text-sm print:mb-2">Detail Layanan</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 border-b font-semibold text-gray-800 print:text-xs">Deskripsi</th>
                    <th className="text-center p-3 border-b font-semibold text-gray-800 print:text-xs">Durasi</th>
                    <th className="text-right p-3 border-b font-semibold text-gray-800 print:text-xs">Harga</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.selectedPackage && (
                    <tr>
                      <td className="p-3 border-b print:text-xs">
                        <div>
                          <span className="font-medium">🌟 Paket {invoiceData.selectedPackage.name}</span>
                          <div className="text-xs text-gray-600 mt-1">
                            Sewa Videobooth 360 
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border-b text-center print:text-xs">{invoiceData.selectedPackage.duration}</td>
                      <td className="p-3 border-b text-right font-medium print:text-xs">
                        {formatCurrency(invoiceData.selectedPackage.price)}
                      </td>
                    </tr>
                  )}
                  
                  {invoiceData.additionalServices.map((service, index) => (
                    <tr key={index}>
                      <td className="p-3 border-b print:text-xs">
                        <span className="font-medium">{service.name}</span>
                      </td>
                      <td className="p-3 border-b text-center print:text-xs">-</td>
                      <td className="p-3 border-b text-right font-medium print:text-xs">
                        {formatCurrency(service.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-6 print:mb-3">
            <div className="w-full max-w-sm">
              <div className="space-y-2 print:space-y-1 print:text-xs">
                <div className="flex justify-between py-2 border-b print:py-1 print:text-xs">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(calculateSubtotal())}</span>
                </div>
                
                {invoiceData.discountPercent > 0 && (
                  <div className="flex justify-between py-2 border-b text-red-600 print:py-1 print:text-xs">
                    <span>Diskon ({invoiceData.discountPercent}%):</span>
                    <span className="font-medium">-{formatCurrency(calculateDiscount())}</span>
                  </div>
                )}
                
                {invoiceData.shippingCost > 0 && (
                  <div className="flex justify-between py-2 border-b print:py-1 print:text-xs">
                    <span className="text-gray-600">Ongkos Kirim:</span>
                    <span className="font-medium">{formatCurrency(invoiceData.shippingCost)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-2 border-b print:py-1 print:text-xs">
                  <span className="text-gray-600">Total Keseluruhan:</span>
                  <span className="font-medium">{formatCurrency(calculateGrandTotal())}</span>
                </div>
                
                {invoiceData.dpAmount > 0 && (
                  <div className="flex justify-between py-2 border-b text-blue-600 print:py-1 print:text-xs">
                    <span>DP (Down Payment):</span>
                    <span className="font-medium">-{formatCurrency(invoiceData.dpAmount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between py-3 border-t-2 border-gray-300 print:py-2 print:text-sm">
                  <span className="text-lg font-semibold print:text-sm">
                    {invoiceData.dpAmount > 0 ? 'Sisa Pembayaran:' : 'Total:'}
                  </span>
                  <span className="text-lg font-bold text-gray-900 print:text-sm">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6 print:mb-3">
            <h3 className="text-lg font-semibold mb-3 text-gray-900 print:text-sm print:mb-2">Catatan</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 print:p-2">
              <p className="text-sm text-gray-700 mb-2 print:text-xs print:mb-1">
                Pelunasan dilakukan paling lambat H-1 sebelum acara
              </p>
              {invoiceData.notes && (
                <p className="text-sm text-gray-700 whitespace-pre-wrap border-t pt-2 print:text-xs print:pt-1 print:mb-1">
                  {invoiceData.notes}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-4 mt-6 print:pt-2 print:mt-3">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2 print:text-xs print:mb-1">
                Terima kasih telah mempercayakan acara Anda kepada S2M Videobooth 360
              </p>
              <p className="text-xs text-gray-500 print:text-xs">
                Invoice ini dibuat secara otomatis dan sah tanpa tanda tangan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}