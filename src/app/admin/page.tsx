import { sql } from '@vercel/postgres';
import AdminDashboard from './components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let reservations: any[] = [];
  
  try {
    // Intentamos crear la tabla si no existe (por seguridad)
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

    const { rows } = await sql`SELECT * FROM reservations`;
    reservations = rows;
  } catch (error) {
    console.error('Error cargando reservas:', error);
    return (
      <div className="min-h-screen bg-neutral-950 p-4 md:p-8 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-12 text-center text-red-400 max-w-md">
          <p className="font-bold text-lg mb-2">Error de conexión</p>
          <p>Revisa la base de datos de Vercel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto mt-4 md:mt-0">
        <AdminDashboard reservations={reservations} />
      </div>
    </div>
  );
}
