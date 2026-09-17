'use client';

import { useState, useEffect } from 'react';
import { createReservation, getBookedTimes } from '@/app/actions';

const MORNING_TIMES = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30'];
const AFTERNOON_TIMES = ['17:00', '17:30', '18:00', '18:30', '19:00', '19:30'];

export default function BookingForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [selectedDate, setSelectedDate] = useState('');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setIsLoadingTimes(true);
      getBookedTimes(selectedDate).then(times => {
        setBookedTimes(times);
        setIsLoadingTimes(false);
      }).catch(() => {
        setIsLoadingTimes(false);
      });
    } else {
      setBookedTimes([]);
    }
  }, [selectedDate]);

  async function handleSubmit(formData: FormData) {
    setStatus('loading');
    setErrorMessage('');
    
    const result = await createReservation(formData);
    
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      if (result.message) {
        setErrorMessage(result.message);
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-amber-500/10 border border-amber-500 rounded-2xl p-8 text-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
        <h3 className="text-2xl font-bold text-white">¡Reserva Confirmada!</h3>
        <p className="text-neutral-400">Te esperamos en Corte Maestro.</p>
        <button 
          onClick={() => { setStatus('idle'); setSelectedDate(''); }}
          className="mt-6 bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-2 rounded-full text-sm transition-colors"
        >
          Hacer otra reserva
        </button>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Nombre Completo</label>
          <input 
            type="text" 
            name="name" 
            required 
            className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            placeholder="Juan Pérez"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Teléfono</label>
          <input 
            type="tel" 
            name="phone" 
            required 
            className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            placeholder="600 000 000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Correo Electrónico (Para confirmación)</label>
        <input 
          type="email" 
          name="email" 
          className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
          placeholder="juan@ejemplo.com (Opcional)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-neutral-300">Servicio</label>
        <select 
          name="service" 
          defaultValue=""
          required
          className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none"
        >
          <option value="" disabled>Selecciona un servicio...</option>
          <option value="Corte Clásico">Corte Clásico (15€)</option>
          <option value="Arreglo de Barba">Arreglo de Barba (10€)</option>
          <option value="Afeitado Tradicional">Afeitado Tradicional (18€)</option>
          <option value="Corte + Barba">Pack: Corte + Barba (22€)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300">Fecha</label>
          <input 
            type="date" 
            name="date" 
            required 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all [color-scheme:dark]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-300 flex justify-between">
            Hora
            {isLoadingTimes && <span className="text-amber-500 text-xs animate-pulse">Cargando...</span>}
          </label>
          <select 
            name="time" 
            required
            defaultValue=""
            disabled={!selectedDate || isLoadingTimes}
            className="w-full text-base sm:text-sm bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none disabled:opacity-50"
          >
            <option value="" disabled>
              {!selectedDate ? 'Selecciona una fecha primero' : 'Selecciona una hora...'}
            </option>
            {selectedDate && (
              <>
                <optgroup label="Mañana">
                  {MORNING_TIMES.map(t => {
                    const isBooked = bookedTimes.includes(t);
                    return (
                      <option key={t} value={t} disabled={isBooked}>
                        {t} {isBooked ? '(Ocupado)' : ''}
                      </option>
                    );
                  })}
                </optgroup>
                <optgroup label="Tarde">
                  {AFTERNOON_TIMES.map(t => {
                    const isBooked = bookedTimes.includes(t);
                    return (
                      <option key={t} value={t} disabled={isBooked}>
                        {t} {isBooked ? '(Ocupado)' : ''}
                      </option>
                    );
                  })}
                </optgroup>
              </>
            )}
          </select>
        </div>
      </div>
      
      {status === 'error' && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <p className="text-red-400 text-sm">{errorMessage || 'Hubo un error al guardar la reserva. Por favor intenta de nuevo.'}</p>
        </div>
      )}

      <button 
        type="submit" 
        disabled={status === 'loading'}
        className="w-full bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-900 font-bold text-lg py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/25 mt-4 flex justify-center items-center gap-2"
      >
        {status === 'loading' ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Procesando...
          </>
        ) : (
          'Confirmar Reserva'
        )}
      </button>
    </form>
  );
}
