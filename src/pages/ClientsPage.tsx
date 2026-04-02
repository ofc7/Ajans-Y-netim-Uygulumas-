import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Search, MoreVertical, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { Client } from '../types';
import ClientModal from '../components/ClientModal';

export default function ClientsPage() {
  const { clients, tasks, deleteClient } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | undefined>(undefined);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClient = () => {
    if (clientToDelete) {
      deleteClient(clientToDelete.id);
      setClientToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Müşteriler</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Ajansınızın marka hesaplarını yönetin.</p>
        </div>
        <button 
          onClick={() => {
            setSelectedClient(undefined);
            setIsClientModalOpen(true);
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Müşteri Ekle
        </button>
      </header>

      <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Müşteri ara..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map(client => {
          const clientTasks = tasks.filter(t => t.clientId === client.id);
          const publishedCount = clientTasks.filter(t => t.status === 'Yayınlandı').length;
          const totalTarget = client.monthlyTargets.posts + client.monthlyTargets.reels + client.monthlyTargets.stories;
          const progress = Math.min(100, Math.round((publishedCount / totalTarget) * 100));

          return (
            <div key={client.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all group">
              <div className="h-2" style={{ backgroundColor: client.brandColor }} />
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: client.brandColor }}
                    >
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
                      <p className="text-sm text-gray-500">{clientTasks.length} aktif görev</p>
                    </div>
                  </div>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-gray-500 uppercase tracking-wider">Aylık Hedef İlerlemesi</span>
                      <span className="text-indigo-600">{publishedCount} / {totalTarget}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-600 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Post</p>
                      <p className="text-sm font-bold text-gray-900">{client.monthlyTargets.posts}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Reels</p>
                      <p className="text-sm font-bold text-gray-900">{client.monthlyTargets.reels}</p>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-lg text-center">
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Hikaye</p>
                      <p className="text-sm font-bold text-gray-900">{client.monthlyTargets.stories}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex gap-2">
                  <button 
                    onClick={() => {
                      setSelectedClient(client);
                      setIsClientModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Düzenle
                  </button>
                  <button 
                    onClick={() => setClientToDelete(client)}
                    className="px-3 py-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {clientToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-4 mb-4 text-red-600">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Müşteriyi Sil</h3>
                <p className="text-sm text-gray-500">Bu işlem geri alınamaz.</p>
              </div>
            </div>
            
            <p className="text-gray-600 mb-6">
              <span className="font-bold">{clientToDelete.name}</span> isimli müşteriyi silmek istediğinize emin misiniz? 
              Bu müşteriye ait tüm görevler de silinecektir.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setClientToDelete(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={handleDeleteClient}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}

      <ClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        client={selectedClient}
      />
    </div>
  );
}
