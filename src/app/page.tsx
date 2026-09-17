import React from "react";
import BookingForm from "@/components/BookingForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans selection:bg-amber-500 selection:text-neutral-900">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter text-amber-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5 8 19"/><path d="M19 12h-4l-3 5-3-5H5l-1-7h16l-1 7z"/></svg>
            Corte Maestro
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#servicios" className="hover:text-amber-500 transition-colors">Servicios</a>
            <a href="#reservas" className="hover:text-amber-500 transition-colors">Reservas</a>
            <a href="#contacto" className="hover:text-amber-500 transition-colors">Contacto</a>
          </div>
          <a href="#reservas" className="bg-amber-600 hover:bg-amber-500 text-neutral-900 px-5 py-2.5 rounded-full font-semibold transition-all">
            Reservar ahora
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop" 
            alt="Barberia" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            El arte del <span className="text-amber-500">buen corte</span>.
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Descubre la experiencia definitiva en barbería clásica. Cortes precisos, afeitados a navaja y un ambiente diseñado para caballeros.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="#reservas" className="bg-amber-600 hover:bg-amber-500 text-neutral-900 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(217,119,6,0.3)] hover:shadow-[0_0_60px_rgba(217,119,6,0.5)]">
              Agendar Cita
            </a>
            <a href="#servicios" className="bg-neutral-800 hover:bg-neutral-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-neutral-700">
              Ver Servicios
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-24 bg-neutral-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Nuestros <span className="text-amber-500">Servicios</span></h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">Calidad y atención al detalle en cada servicio.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Corte Clásico", price: "15€", desc: "Asesoramiento, lavado, corte a tijera o máquina y peinado final." },
              { title: "Arreglo de Barba", price: "10€", desc: "Diseño, rebaje y perfilado con navaja, toalla caliente y aceites esenciales." },
              { title: "Afeitado Tradicional", price: "18€", desc: "Afeitado completo a navaja con toallas calientes y masaje facial." },
              { title: "Pack: Corte + Barba", price: "22€", desc: "La experiencia completa. Corte de pelo y arreglo de barba premium." },
            ].map((service, i) => (
              <div key={i} className="bg-neutral-900 p-8 rounded-2xl border border-neutral-800 hover:border-amber-500/50 transition-colors group">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-2xl font-bold group-hover:text-amber-500 transition-colors">{service.title}</h3>
                  <span className="text-xl font-semibold text-amber-500">{service.price}</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="reservas" className="py-24 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-neutral-950 rounded-3xl p-8 md:p-12 border border-neutral-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full" />
            
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Reserva tu momento</h2>
              <p className="text-neutral-400 mb-8">Completa el formulario y tu cita quedará registrada al instante.</p>
              
              {/* NOTE: Formspree Integration for Email */}
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-neutral-950 py-12 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-neutral-400">
          <div>
            <div className="text-2xl font-bold tracking-tighter text-amber-500 mb-4">Corte Maestro</div>
            <p className="text-sm">Recuperando la tradición de la barbería clásica con técnicas modernas y atención personalizada.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Horario</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between"><span>Lunes - Viernes:</span> <span>09:00 - 14:00 | 17:00 - 20:00</span></li>
              <li className="flex justify-between"><span>Sábados:</span> <span>09:00 - 14:00</span></li>
              <li className="flex justify-between text-amber-500"><span>Domingos:</span> <span>Cerrado</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Contacto y Ubicación</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                Calle Falsa 123, Madrid
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +34 600 000 000
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
