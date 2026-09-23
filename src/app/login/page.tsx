"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "Corte2026") {
      document.cookie = "auth_token=Corte2026; path=/; max-age=86400"; // 1 day expiration
      router.push("/admin");
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-[#0a0a0a] border border-[#333] p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl">
        <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-6 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
          CM
        </div>
        <h2 className="text-white text-xl font-semibold mb-2">Panel Privado</h2>
        <p className="text-[#a1a1aa] text-sm mb-6">
          Introduce la contraseña para acceder a la gestión de reservas.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full bg-[#111] border border-[#333] text-white px-4 py-3 rounded-lg outline-none focus:border-amber-500 transition-colors text-center"
            autoFocus
          />
          
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Entrar
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-2 rounded-lg transition-opacity">
            Contraseña incorrecta
          </div>
        )}
      </div>
    </div>
  );
}
