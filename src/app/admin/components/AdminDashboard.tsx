'use client';

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
  const [menuOpen, setMenuOpen] = useState(false);

  // Obtener fecha de hoy en formato YYYY-MM-DD para comparar (hora local España aprox)
  const today = new Date();
  // Ajuste rápido de timezone a YYYY-MM-DD local
  const todayStr = new Date(today.getTime() - (today.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

  // Separar y ordenar
  const upcoming = reservations.filter(r => r.date >= todayStr).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
  
  const past = reservations.filter(r => r.date < todayStr).sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date); // Más recientes primero en historial
    return b.time.localeCompare(a.time);
  });

  // Agrupar por fechas
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

  // Formatear fecha para cabecera (ej: "Jueves, 19 Septiembre")
  const formatDate = (dateStr: string) => {
    if (dateStr === todayStr) return "Hoy";
    
    const d = new Date(dateStr);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = new Date(tomorrow.getTime() - (tomorrow.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    
    if (dateStr === tomorrowStr) return "Mañana";

    return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  return (
    <div>
      {/* Header de la App */}
      <div className="flex justify-between items-center mb-6 relative">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-500 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          {view === 'upcoming' ? 'Próximas Citas' : 'Historial'}
        </h1>

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white hover:text-amber-500 transition-colors z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {menuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
            ) : (
              <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>
            )}
          </svg>
        </button>

        {/* Menú Desplegable */}
        {menuOpen && (
          <div className="absolute top-12 right-0 w-48 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl z-40 overflow-hidden">
            <button 
              onClick={() => { setView('upcoming'); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${view === 'upcoming' ? 'bg-amber-500/10 text-amber-500' : 'text-white hover:bg-neutral-800'}`}
            >
              Próximas Citas
            </button>
            <button 
              onClick={() => { setView('past'); setMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${view === 'past' ? 'bg-amber-500/10 text-amber-500' : 'text-white hover:bg-neutral-800'}`}
            >
              Historial (Antiguas)
            </button>
          </div>
        )}
      </div>

      {/* Contenido */}
      {currentList.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 text-center text-neutral-400">
          No hay citas en esta sección.
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([dateStr, dayReservations]) => (
            <div key={dateStr} className="space-y-4">
              {/* Separador de Día */}
              <div className="sticky top-0 z-10 bg-neutral-950/90 backdrop-blur-sm py-2 border-b border-neutral-800 flex items-center justify-between">
                <h2 className="text-lg font-bold text-white capitalize">{formatDate(dateStr)}</h2>
                <span className="text-xs font-semibold bg-neutral-800 text-neutral-400 px-2 py-1 rounded-full">
                  {dayReservations.length} {dayReservations.length === 1 ? 'cita' : 'citas'}
                </span>
              </div>

              {/* Lista de Tarjetas para ese día */}
              <div className="flex flex-col gap-4">
                {dayReservations.map((res) => (
                  <div key={res.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
                    {/* Borde izquierdo de color para destacar el estado (opcional) */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${view === 'upcoming' ? 'bg-amber-500' : 'bg-neutral-600'}`} />
                    
                    <div className="pl-2">
                      <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-white text-3xl tracking-tight">{res.time}</div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20 text-center max-w-[140px] leading-tight">
                          {res.service}
                        </span>
                      </div>
                      
                      <div className="space-y-2 bg-neutral-950/50 rounded-lg p-3 border border-neutral-800/50">
                        <div className="font-semibold text-white text-lg">{res.name}</div>
                        <div className="text-neutral-400 text-sm flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {res.phone}
                        </div>
                        {res.email && (
                          <div className="text-neutral-500 text-sm flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                            {res.email}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
