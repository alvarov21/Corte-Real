import { sql } from '@vercel/postgres';
import AdminDashboard from './components/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let reservations: any[] = [];
  
  try {
    const { rows } = await sql`SELECT * FROM reservations`;
    reservations = rows;
  } catch (error) {
    console.error('Error cargando reservas:', error);
    return (
      <div className="min-h-screen bg-black p-4 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-12 text-center text-red-400 max-w-md">
          <p className="font-bold text-lg mb-2">Error de conexión</p>
          <p>Revisa la base de datos de Vercel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#ededed] font-sans">
      <AdminDashboard reservations={reservations} />
    </div>
  );
}
