import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corte Maestro - Barbería Clásica",
  description: "Reserva tu cita en Corte Maestro",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased min-h-full flex flex-col bg-neutral-950 text-neutral-100">
        {children}
      </body>
    </html>
  );
}
