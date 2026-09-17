'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// Función auxiliar para asegurarnos de que la tabla existe
async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS reservations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255) NOT NULL,
        date VARCHAR(50) NOT NULL,
        time VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
  } catch (e) {
    console.error('Error creating table', e);
  }
}

export async function getBookedTimes(date: string) {
  try {
    await initDb();
    const { rows } = await sql`SELECT time FROM reservations WHERE date = ${date}`;
    return rows.map((res) => res.time);
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
    await initDb();
    
    // 1. Convertir la hora a minutos desde la medianoche para comparar fácilmente
    const timeToMinutes = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    
    const newTimeMinutes = timeToMinutes(time);

    // 2. Obtener todas las citas para ese mismo día
    const { rows: existingReservations } = await sql`SELECT time FROM reservations WHERE date = ${date}`;

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
    await sql`
      INSERT INTO reservations (name, phone, email, service, date, time)
      VALUES (${name}, ${phone}, ${email}, ${service}, ${date}, ${time})
    `;
    
    // Revalidar la página de admin para que muestre la nueva cita
    revalidatePath('/admin');
    
    return { success: true };
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    return { error: 'Error al procesar la reserva' };
  }
}
