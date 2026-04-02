import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, Building2, User, Bell, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { agencyName, updateAgencyName } = useApp();
  const [name, setName] = useState(agencyName);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateAgencyName(name);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Ayarlar</h1>
        <p className="text-gray-500 mt-1">Uygulama yapılandırmasını ve tercihlerinizi yönetin.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="flex flex-col gap-1">
            <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg text-left">
              <Building2 className="w-4 h-4" />
              Ajans Profili
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg text-left">
              <User className="w-4 h-4" />
              Hesabım
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg text-left">
              <Bell className="w-4 h-4" />
              Bildirimler
            </button>
            <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg text-left">
              <Shield className="w-4 h-4" />
              Güvenlik
            </button>
          </nav>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Ajans Bilgileri</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ajans İsmi
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="Ajans ismini girin"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-posta Adresi
                </label>
                <input 
                  type="email"
                  defaultValue="info@kiyimedya.com"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  disabled
                />
                <p className="mt-1 text-xs text-gray-400 italic">E-posta adresi şu an için değiştirilemez.</p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </button>
                {isSaved && (
                  <span className="text-sm font-medium text-green-600 animate-in fade-in slide-in-from-left-2 duration-300">
                    Başarıyla kaydedildi!
                  </span>
                )}
              </div>
            </form>
          </section>

          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Görünüm</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Koyu Tema</p>
                  <p className="text-xs text-gray-500">Uygulama genelinde koyu renk paletini kullan.</p>
                </div>
                <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-not-allowed">
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </div>
              <p className="text-xs text-gray-400 italic">Bazı özellikler geliştirme aşamasındadır.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
