"use client";

import { useState } from 'react';

type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  date: string; // YYYY-MM-DD
  time: string;
  created_at: string;
};

export default function AdminDashboard({ reservations }: { reservations: Reservation[] }) {
  const [view, setView] = useState<'upcoming' | 'past'>('upcoming');

  const today = new Date();
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  const upcoming = reservations.filter(r => r.date >= todayStr).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
  
  const past = reservations.filter(r => r.date < todayStr).sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return b.time.localeCompare(a.time);
  });

  const groupReservations = (resList: Reservation[]) => {
    const grouped: Record<string, Reservation[]> = {};
    resList.forEach(res => {
      if (!grouped[res.date]) grouped[res.date] = [];
      grouped[res.date].push(res);
    });
    return grouped;
  };

  const currentList = view === 'upcoming' ? upcoming : past;
  const grouped = groupReservations(currentList);

  const formatDate = (dateStr: string) => {
    if (dateStr === todayStr) return "Hoy";
    const d = new Date(dateStr);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    if (dateStr === tomorrowStr) return "Mañana";
    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const getDuration = (service: string) => {
    if (service.toLowerCase().includes('barba')) return '1h';
    if (service.toLowerCase().includes('completo')) return '1h 15m';
    return '45 min';
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation */}
      <nav className="border-b border-[#333] bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                  CM
                </div>
                <span className="font-medium text-sm tracking-wide text-white">Corte Maestro</span>
                <span className="bg-[#333] text-[#ededed] text-[10px] px-2 py-0.5 rounded-full font-medium ml-2">PRO</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-1 md:mb-2 text-white">Bandeja de Entrada</h1>
            <p className="text-[#a1a1aa] text-xs md:text-sm">Gestiona tus reservas y el historial de clientes.</p>
          </div>
          <div className="flex gap-2 md:gap-3 w-full md:w-auto">
            <button 
              onClick={() => setView('upcoming')} 
              className={`flex-1 md:flex-none px-4 py-2.5 md:py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${view === 'upcoming' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-[#111] border border-[#333] text-[#a1a1aa] hover:text-white hover:border-[#444]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
              Próximas
            </button>
            <button 
              onClick={() => setView('past')}
              className={`flex-1 md:flex-none px-4 py-2.5 md:py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${view === 'past' ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111] border border-[#333] text-[#a1a1aa] hover:text-white hover:border-[#444]'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              Historial
            </button>
          </div>
        </div>

        {/* Metrics Cards */}
        {view === 'upcoming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-5 flex flex-col justify-between shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#a1a1aa] text-sm font-medium">Reservas Activas</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa]"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold text-white">{upcoming.length}</span>
                <span className="text-[#a1a1aa] text-sm mb-1">Citas pendientes</span>
              </div>
            </div>
            
            <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-5 flex flex-col justify-between shadow-lg hidden md:flex">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#a1a1aa] text-sm font-medium">Hoy</h3>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa]"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              </div>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-semibold text-white">{upcoming.filter(r => r.date === todayStr).length}</span>
                <span className="text-[#a1a1aa] text-sm mb-1">Citas para hoy</span>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        {currentList.length === 0 ? (
          <div className="text-center text-[#a1a1aa] py-10 bg-[#0a0a0a] rounded-xl border border-[#333]">
            No hay citas en esta sección.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.keys(grouped).sort((a, b) => view === 'upcoming' ? a.localeCompare(b) : b.localeCompare(a)).map((dateStr) => {
              const dayBookings = grouped[dateStr];
              return (
                <div key={dateStr} className="mb-6">
                  <h3 className="text-white font-medium border-b border-[#333] pb-2 mb-4 sticky top-16 bg-black z-10 capitalize flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#a1a1aa]"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                    {formatDate(dateStr)}
                  </h3>
                  
                  <div className="space-y-3">
                    {dayBookings.map((b) => (
                      <div key={b.id} className="bg-[#111] border border-[#222] p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between hover:border-[#444] transition-colors gap-4">
                        <div className="flex items-center gap-4">
                          <div className={`font-bold px-3 py-1.5 rounded-md border w-16 text-center shrink-0 ${view === 'upcoming' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-neutral-800 text-neutral-400 border-neutral-700'}`}>
                            {b.time}
                          </div>
                          <div>
                            <h4 className="text-white font-medium truncate max-w-[200px] sm:max-w-[300px]">{b.name}</h4>
                            <p className="text-[#a1a1aa] text-xs truncate max-w-[200px] sm:max-w-[300px]">{b.service}</p>
                          </div>
                        </div>
                        <div className="text-left sm:text-right shrink-0 ml-20 sm:ml-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                          <p className="text-[#a1a1aa] text-xs sm:mb-1 flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            {b.phone}
                          </p>
                          <span className="bg-[#333] text-[#ededed] text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                            {getDuration(b.service)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
