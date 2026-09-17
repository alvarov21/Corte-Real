'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getBookedTimes(date: string) {
  try {
    const reservations = db.prepare('SELECT time FROM reservations WHERE date = ?').all(date) as { time: string }[];
    return reservations.map((res) => res.time);
  } catch (error) {
    console.error('Error fetching booked times:', error);
    return [];
  }
}

export async function createReservation(formData: FormData) {
  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const email = formData.get('email') as string;
  const service = formData.get('service') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;

  if (!name || !phone || !service || !date || !time) {
    return { error: 'Faltan campos obligatorios' };
  }

  try {
    // 1. Convertir la hora a minutos desde la medianoche para comparar fácilmente
    const timeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    
    const newTimeMinutes = timeToMinutes(time);

    // 2. Obtener todas las citas para ese mismo día
    const existingReservations = db.prepare('SELECT time FROM reservations WHERE date = ?').all(date) as { time: string }[];

    // 3. Comprobar que no haya solapamiento (30 minutos por servicio)
    for (const res of existingReservations) {
      const existingTimeMinutes = timeToMinutes(res.time);
      if (Math.abs(existingTimeMinutes - newTimeMinutes) < 30) {
        return { 
          error: 'overlap', 
          message: 'Esa hora se solapa con otra cita. Deja al menos 30 minutos de margen.' 
        };
      }
    }

    // 4. Si está libre, insertamos la reserva
    const stmt = db.prepare(`
      INSERT INTO reservations (name, phone, email, service, date, time)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(name, phone, email, service, date, time);
    
    // Revalidar la página de admin para que muestre la nueva cita
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    return { error: 'Error al procesar la reserva' };
  }
}
