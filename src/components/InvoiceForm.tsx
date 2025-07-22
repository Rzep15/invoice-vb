import React from 'react';
import { Plus, Minus, FileText } from 'lucide-react';
import type { InvoiceData, Package } from '../App';

interface InvoiceFormProps {
  invoiceData: InvoiceData;
  setInvoiceData: React.Dispatch<React.SetStateAction<InvoiceData>>;
  packages: Package[];
  onGenerateInvoice: () => void;
}

export default function InvoiceForm({ invoiceData, setInvoiceData, packages, onGenerateInvoice }: InvoiceFormProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const addAdditionalService = () => {
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: [...prev.additionalServices, { name: '', price: 0 }]
    }));
  };

  const removeAdditionalService = (index: number) => {
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.filter((_, i) => i !== index)
    }));
  };

  const updateAdditionalService = (index: number, field: 'name' | 'price', value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customer Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-yellow-400 border-b border-gray-700 pb-2">
            Informasi Customer
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tanggal Invoice
              </label>
              <input
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                No. Invoice (Manual)
              </label>
              <input
                type="text"
                value={invoiceData.invoiceNumber}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="INV-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nama Customer *
              </label>
              <input
                type="text"
                value={invoiceData.customerName}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Masukkan nama customer"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                No. Telepon
              </label>
              <input
                type="tel"
                value={invoiceData.customerPhone}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="08xx-xxxx-xxxx"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Alamat
              </label>
              <textarea
                value={invoiceData.customerAddress}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, customerAddress: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                rows={3}
                placeholder="Alamat lengkap customer"
              />
            </div>
          </div>
        </div>

        {/* Event Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-yellow-400 border-b border-gray-700 pb-2">
            Informasi Event
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tanggal Event
              </label>
              <input
                type="date"
                value={invoiceData.eventDate}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, eventDate: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Jenis Event
              </label>
              <input
                type="text"
                value={invoiceData.eventLocation}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, eventLocation: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                placeholder="Contoh: Wedding, Ulang Tahun, Gathering"
              />
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Catatan
              </label>
              <textarea
                value={invoiceData.notes}
                onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                rows={3}
                placeholder="Catatan tambahan atau terms & conditions"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Package Selection */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-yellow-400 border-b border-gray-700 pb-2 mb-6">
          Pilih Paket Layanan *
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setInvoiceData(prev => ({ ...prev, selectedPackage: pkg }))}
              className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all transform hover:scale-105 ${
                invoiceData.selectedPackage?.id === pkg.id
                  ? 'border-blue-400 bg-gradient-to-br from-blue-400/10 to-blue-600/5 shadow-lg'
                  : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
              }`}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-400 rounded-full mb-4">
                  <span className="text-black font-bold text-lg">
                    {pkg.name.charAt(0)}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">🌟 {pkg.name}</h4>
                <p className="text-gray-300 mb-2">({pkg.duration})</p>
                <p className="text-2xl font-bold text-blue-400 mb-4">
                  {formatCurrency(pkg.price)}
                </p>
                <div className="text-left">
                  <p className="text-sm text-gray-400 mb-2">Rekomendasi:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    {pkg.recommendations.map((rec, index) => (
                      <li key={index}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {invoiceData.selectedPackage?.id === pkg.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-yellow-400">
            Layanan Tambahan (Opsional)
          </h3>
          <button
            onClick={addAdditionalService}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah</span>
          </button>
        </div>

        {invoiceData.additionalServices.map((service, index) => (
          <div key={index} className="flex items-center space-x-4 mb-4">
            <input
              type="text"
              value={service.name}
              onChange={(e) => updateAdditionalService(index, 'name', e.target.value)}
              placeholder="Nama layanan tambahan"
              className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <input
              type="number"
              value={service.price}
              onChange={(e) => updateAdditionalService(index, 'price', parseInt(e.target.value) || 0)}
              placeholder="Harga"
              className="w-32 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
            <button
              onClick={() => removeAdditionalService(index)}
              className="p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Pricing Details */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Diskon (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={invoiceData.discountPercent === 0 ? '' : invoiceData.discountPercent}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, discountPercent: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Ongkos Kirim
          </label>
          <input
            type="number"
            min="0"
            value={invoiceData.shippingCost === 0 ? '' : invoiceData.shippingCost}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, shippingCost: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            DP (Down Payment)
          </label>
          <input
            type="number"
            min="0"
            value={invoiceData.dpAmount === 0 ? '' : invoiceData.dpAmount}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, dpAmount: e.target.value === '' ? 0 : parseInt(e.target.value) || 0 }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            placeholder="0"
          />
        </div>
      </div>

      {/* Payment Status */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Status Pembayaran
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentStatus"
              value="lunas"
              checked={invoiceData.paymentStatus === 'lunas'}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentStatus: e.target.value as 'lunas' | 'belum_lunas' }))}
              className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-400"
            />
            <span className="text-green-400 font-medium">Lunas</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="paymentStatus"
              value="belum_lunas"
              checked={invoiceData.paymentStatus === 'belum_lunas'}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentStatus: e.target.value as 'lunas' | 'belum_lunas' }))}
              className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 focus:ring-blue-400"
            />
            <span className="text-red-400 font-medium">Belum Lunas</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <div className="mt-8 text-center">
        <button
          onClick={onGenerateInvoice}
          className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition-all shadow-lg"
        >
          <FileText className="h-5 w-5" />
          <span>Generate Invoice</span>
        </button>
      </div>
    </div>
  );
}