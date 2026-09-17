import { sql } from '@vercel/postgres';

export const dynamic = 'force-dynamic';

type Reservation = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  date: string;
  time: string;
  created_at: string;
};

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-950 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-amber-500 mb-8 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
          Panel de Reservas
        </h1>
        
        <ReservationsTable />
      </div>
    </div>
  );
}

// Lo separamos en un componente asíncrono para que pueda hacer fetch a la BD
async function ReservationsTable() {
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

    const { rows } = await sql`SELECT * FROM reservations ORDER BY date ASC, time ASC`;
    const reservations = rows as Reservation[];

    if (reservations.length === 0) {
      return (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center text-neutral-400">
          No hay citas registradas todavía.
        </div>
      );
    }

    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 text-neutral-400 text-sm border-b border-neutral-800">
                <th className="p-4 font-semibold">Día y Hora</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Contacto</th>
                <th className="p-4 font-semibold">Servicio</th>
                <th className="p-4 font-semibold text-right">Solicitada el</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {reservations.map((res) => (
                <tr key={res.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-lg">{res.time}</div>
                    <div className="text-amber-500 font-medium text-sm">{res.date}</div>
                  </td>
                  <td className="p-4 font-medium text-white">{res.name}</td>
                  <td className="p-4">
                    <div className="text-white">{res.phone}</div>
                    {res.email && <div className="text-sm text-neutral-500">{res.email}</div>}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      {res.service}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-neutral-500">
                    {new Date(res.created_at).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error cargando reservas:', error);
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-12 text-center text-red-400">
        <p className="font-bold text-lg mb-2">Error de conexión a la Base de Datos</p>
        <p>Asegúrate de haber creado la base de datos "Postgres" en el panel de Vercel y haber vinculado el proyecto.</p>
      </div>
    );
  }
}
