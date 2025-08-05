import React, { useState } from 'react';
import { Phone, Mail, Instagram } from 'lucide-react';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

export interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
  recommendations: string[];
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  eventDate: string;
  eventLocation: string;
  selectedPackage: Package | null;
  additionalServices: Array<{ name: string; price: number }>;
  discountPercent: number;
  shippingCost: number;
  dpAmount: number;
  paymentStatus: 'lunas' | 'belum_lunas';
  notes: string;
}

const packages: Package[] = [
  {
    id: 'silver',
    name: 'SILVER',
    duration: '3 Jam',
    price: 1200000,
    recommendations: ['Ulang tahun', 'farewell', 'gathering']
  },
  {
    id: 'gold',
    name: 'GOLD',
    duration: '5 Jam',
    price: 1500000,
    recommendations: ['Resepsi nikah', 'seminar', 'festival']
  },
  {
    id: 'diamond',
    name: 'DIAMOND',
    duration: '7 Jam',
    price: 2000000,
    recommendations: ['Wedding full day', 'konser', 'expo']
  }
];

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    eventDate: '',
    eventLocation: '',
    selectedPackage: null,
    additionalServices: [],
    discountPercent: 0,
    shippingCost: 0,
    dpAmount: 0,
    paymentStatus: 'belum_lunas',
    notes: ''
  });

  const handleGenerateInvoice = () => {
    if (!invoiceData.customerName || !invoiceData.selectedPackage) {
      alert('Mohon lengkapi nama customer dan pilih paket terlebih dahulu');
      return;
    }
    setShowPreview(true);
  };

  const handleBackToForm = () => {
    setShowPreview(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 to-blue-600 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://i.imgur.com/IJxCjEL.png" 
                alt="S2M Videobooth 360" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-2xl font-bold text-black">S2M Videobooth 360</h1>
                <p className="text-white/80 text-sm">Sewa Videobooth 360</p>
              </div>
            </div>
            <div className="hidden md:flex flex-col items-end space-y-1 text-white text-sm">
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
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {!showPreview ? (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Invoice Generator</h2>
              <p className="text-gray-300">Buat invoice profesional untuk layanan videobooth Anda</p>
            </div>
            
            <InvoiceForm 
              invoiceData={invoiceData}
              setInvoiceData={setInvoiceData}
              packages={packages}
              onGenerateInvoice={handleGenerateInvoice}
            />
          </div>
        ) : (
          <InvoicePreview 
            invoiceData={invoiceData}
            onBackToForm={handleBackToForm}
          />
        )}
      </main>
    </div>
  );
}

export default App;